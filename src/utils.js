// API variables
const TOKEN = process.env.TREFLE_API_KEY;
console.log(TOKEN);

const TREFLE_API_URL = `https://trefle.io/api/v1/plants?token=${TOKEN}`;

// generate unique random number

const generateUniqueRandom = (length) => {
  let previousNum = null;
  const randomNum = Math.floor(Math.random() * (length + 1));

  if (previousNum === randomNum) {
    generateUniqueRandom();
  } else {
    previousNum = randomNum;
    return randomNum;
  }
};

// fetch data from API
const fetchData = async () => {
  const response = await fetch(TREFLE_API_URL);
  const json = await response.json();
  console.log(json);
  return json.data;
};

export { fetchData, generateUniqueRandom };
