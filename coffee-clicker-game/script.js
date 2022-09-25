/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/

function updateCoffeeView(coffeeQty) {
  const coffeeCounter = document.getElementById('coffee_counter');
  coffeeCounter.innerText = coffeeQty;
}

function clickCoffee(data) {
  data.coffee += 1;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/**************
 *   SLICE 2
 **************/

function unlockProducers(producers, coffeeCount) {
  producers.forEach(producer => {
    if (coffeeCount >= producer.price/2) producer.unlocked = true;
  });
}

function getUnlockedProducers(data) {
  // returns an array
  return data.producers.filter(producer => {
    if (producer.unlocked) return producer;
  });
}

function makeDisplayNameFromId(id) {
  // split id by '_', then map each string to correct casing, then join newly mapped array by ' '
  return id.split('_').map(str => str[0].toUpperCase() + str.slice(1)).join(' ');
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer';
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div class="desc">Quantity: ${producer.qty}</div>
    <div class="desc">Coffee/second: ${producer.cps}</div>
    <div class="desc">Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function renderProducers(data) {
  const producerContainer = document.getElementById('producer_container');

  // unlocks any locked producers that need to be unlocked, then get array of the unlocked producers
  unlockProducers(data.producers, data.coffee);
  const unlockedProducers = getUnlockedProducers(data);

  // delets all of producer container's children before appending new producers
  deleteAllChildNodes(producerContainer);

  // for each producer, make the producer div and then append it to the producer_container
  unlockedProducers.forEach(producer => {
    producerContainer.appendChild(makeProducerDiv(producer));
  });
}

/**************
 *   SLICE 3
 **************/

function getProducerById(data, producerId) {
  const producers = data.producers;
  let i = 0;

  while (producers[i]) {
    if (producers[i].id === producerId) return producers[i];
    i++;
  }
}

function canAffordProducer(data, producerId) {
  return (data.coffee >= getProducerById(data, producerId).price);
}

function updateCPSView(cps) {
  const cpsIndicator = document.getElementById('cps');
  cpsIndicator.innerText = cps;
}

function updatePrice(oldPrice) {
  return Math.floor(oldPrice * 1.25);
}

function attemptToBuyProducer(data, producerId) {
  if (canAffordProducer(data, producerId)) {
    const producer = getProducerById(data, producerId);

    // decrement user's coffee count by the price of the producer, and increment the producer's quantity by 1
    data.coffee -= producer.price;
    producer.qty += 1;

    // after user buys a producer, this will update the price of the producer
    producer.price = updatePrice(producer.price);
    
    // update the total CPS
    data.totalCPS += producer.cps;

    return true;
  } else {
    return false;
  }
}

function buyButtonClick(event, data) {
  // only if event is a click on the button element, then attempt to buy producer
  const target = event.target;
  if (event.target.tagName === "BUTTON") {
      const producerId = event.target.id.split('_').slice(1).join('_');
      const result = attemptToBuyProducer(data, producerId);

      // renders the updated producers & update the coffee count and cps on the DOM
      renderProducers(data);
      updateCoffeeView(data.coffee);
      updateCPSView(data.totalCPS);

      // if  user cannot afford the producer, alert the user
      if (!result) window.alert("Not enough coffee!");
  }
}

function tick(data) {
  data.coffee += data.totalCPS;
  updateCoffeeView(data.coffee);
  renderProducers(data);
}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === 'undefined') {
  // Get starting data from the window object
  // (This comes from data.js)
  
  // EXTRA CREDIT -- if there is existing game data, update window.data. Then display it in browser view
  if (window.localStorage.length) {
    window.data = JSON.parse(window.localStorage.getItem('data'));
    updateCoffeeView(window.data.coffee);
    updateCPSView(window.data.totalCPS);
    renderProducers(window.data);
  }
  const data = window.data;

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById('big_coffee');
  bigCoffee.addEventListener('click', () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById('producer_container');
  producerContainer.addEventListener('click', event => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);


  // EXTRA CREDIT --
  // Periodically save the game state using window.localStorage (every 60 seconds)
  setInterval(() => {
    window.localStorage.setItem('data', JSON.stringify(data));
  }, 60000);


}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick
  };
}
