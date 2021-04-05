import { fetchData, generateUniqueRandom } from "./utils.js";

// grab from HTML elements
const commonName = document.querySelector(".common-name");
const familyCommonName = document.querySelector(".family-common-name");
const treeImage = document.querySelector(".tree-image");

const main = async () => {
  const jsonData = await fetchData();

  const uniqueRandom = generateUniqueRandom(jsonData.length);

  commonName.innerText = jsonData[uniqueRandom].common_name;
  familyCommonName.innerText = jsonData[uniqueRandom].family_common_name;
  treeImage.src = jsonData[uniqueRandom].image_url;
};

main();
