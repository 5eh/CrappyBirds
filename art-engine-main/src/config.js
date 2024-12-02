const baseUri = "ipfs://YOUR_CID_PLACEHOLDER";
const description = "CrappyBirds NFT Collection - A memecoin-themed flappy bird game";
const baseImageUri = "ipfs://YOUR_CID_PLACEHOLDER";

const layerConfigurations = [
  {
    growEditionSizeTo: 20000,
    namePrefix: "CrappyBird",
    layersOrder: [
      { name: "beak" },
      { name: "crap" },
      { name: "headgear" },
      { name: "eyes" },
      { name: "wings" },
      { name: "body" }
    ],
  },
];

const format = {
  width: 520,
  height: 520,
  smoothing: false,
};

const background = {
  generate: true,
  brightness: "80%",
};

const extraMetadata = {
  external_url: "YOUR_GAME_URL",
  attributes: [
    {
      display_type: "boost_number",
      trait_type: "Flight Speed",
      value: Math.floor(Math.random() * 100),
    },
    {
      display_type: "boost_number",
      trait_type: "Coin Multiplier",
      value: Math.floor(Math.random() * 10),
    }
  ]
};

const rarityDelimiter = "#";
const uniqueDnaTorrance = 10000;

const preview = {
  thumbPerRow: 5,
  thumbWidth: 50,
  imageRatio: format.height / format.width,
  imageName: "preview.png",
};

module.exports = {
  format,
  baseUri,
  description,
  background,
  uniqueDnaTorrance,
  layerConfigurations,
  rarityDelimiter,
  preview,
  extraMetadata,
  baseImageUri
}; 