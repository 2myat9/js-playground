import { fetchData, generateUniqueRandom } from "./utils.js";

const dragItem = document.querySelector(".drag-item");
const dragContainer = document.querySelector(".drag-container");

// for pulling tree img
const image1 = document.querySelector(".image1");
const image2 = document.querySelector(".image2");

// rects
const rectDragItem = dragItem.getBoundingClientRect();
const rectImage1 = image1.getBoundingClientRect();
const rectImage2 = image2.getBoundingClientRect();

// set cooridnate variables to be used in functions
let active = false;
let currentX;
let currentY;
let initialX;
let initialY;
// offset is required to avoid the dragItem snapping to exact position of pointer
let offsetX = 0;
let offsetY = 0;

// function that will move the element
const setTranslate = (xPos, yPos, el) => {
  el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
};

// drag functions
const dragStart = (e) => {
  // check if touch or mouse
  if (e.type === "touchstart") {
    // set the starting coordinates of the drag element
    initialX = e.touches[0].clientX - offsetX;
    initialY = e.touches[0].clientY - offsetY;
  } else {
    initialX = e.clientX - offsetX;
    initialY = e.clientY - offsetY;
  }

  if (e.target === dragItem) {
    active = true;
  }
};

const dragEnd = (e) => {
  // set the final position as initial for next time
  initialX = currentX;
  initialY = currentY;

  // originally placed in drag but I put them here (no apparent changes on screen)
  // bcuz offsetX,Y aren't being used in drag anyway so I put them in dragEnd instead
  offsetX = currentX;
  offsetY = currentY;

  active = false;
};

// returns boolean for overlap
const isOverlap = (rect1, rect2) => {
  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
};

const drag = (e) => {
  // only triggers when active
  if (active) {
    e.preventDefault();

    // calculate new coordinates
    if (e.type === "touchmove") {
      // uses the initial position set by dragStart to find current position
      currentX = e.touches[0].clientX - initialX;
      currentY = e.touches[0].clientY - initialY;
    } else {
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
    }

    // call the function that will move the element
    setTranslate(currentX, currentY, dragItem);

    // check overlap
    checkOverlap();
  }
};

// fetch and set tree images
const startQuiz = async () => {
  let treeNameList = [];
  const jsonData = await fetchData();
  const setTree1 = () => {
    const uniqueRandom = generateUniqueRandom(jsonData.length);
    image1.src = jsonData[uniqueRandom].image_url;
    image1.dataset.treeName = jsonData[uniqueRandom].common_name;
    treeNameList.push(image1.dataset.treeName);
    return image1.dataset.treeName;
  };
  const setTree2 = (tn1) => {
    image2.dataset.treeName = tn1;
    while (image2.dataset.treeName == tn1) {
      const uniqueRandom = generateUniqueRandom(jsonData.length);
      image2.src = jsonData[uniqueRandom].image_url;
      image2.dataset.treeName = jsonData[uniqueRandom].common_name;
    }
    treeNameList.push(image2.dataset.treeName);
  };
  const setDragItem = () => {
    const randomNum = Math.floor(Math.random() * 2);
    dragItem.innerText = treeNameList[randomNum];
  };
  const treeName1 = setTree1();
  setTree2(treeName1);
  setDragItem();
};

// take action when overlapped
const checkOverlap = () => {
  // check overlap
  if (isOverlap(dragItem.getBoundingClientRect(), rectImage1)) {
    if (image1.dataset.treeName === dragItem.innerText) {
      image1.classList.add("overlapped");
    } else {
      image1.classList.remove("overlapped");
    }
  } else if (isOverlap(dragItem.getBoundingClientRect(), rectImage2)) {
    if (image2.dataset.treeName === dragItem.innerText) {
      image2.classList.add("overlapped");
    } else {
      image2.classList.remove("overlapped");
    }
  } else {
    image1.classList.remove("overlapped");
    image2.classList.remove("overlapped");
  }
};

// const debounceCheckOverlap = _.debounce(checkOverlap, 200);

dragContainer.addEventListener("mousedown", dragStart, false);
dragContainer.addEventListener("mouseup", dragEnd, false);
dragContainer.addEventListener("mousemove", drag, false);

// handling touch changes listeners but still calls the same functions
dragContainer.addEventListener("touchstart", dragStart, false);
dragContainer.addEventListener("touchend", dragEnd, false);
dragContainer.addEventListener("touchmove", drag, false);

startQuiz();
