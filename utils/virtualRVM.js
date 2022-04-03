const axios = require("axios").default;

async function scanWaste(nodeSerial) {
  try {
    //CAMERA SCAN LOGIC
    let scrap = "Laptop";

    //PROCESSING LOGIC
    let result = ["Phone", "Charger", "Laptop"].includes(scrap);

    if (result) {
      let reportResponse = await axios.put(
        `http://localhost:8000/rvm/reportScan/${nodeSerial}`,
        {
          scanResult: result,
          scrapType: "Laptop",
          weight: 10,
        }
      );
    }

    //READ RVM status
    let precentage = "20";

    let statusResponse = await axios.put(
      `http://localhost:8000/rvm/reportStatus/${nodeSerial}`,
      {binGauge: precentage}
    );
  } catch (e) {
    console.log(e);
  }
}

//VIRTUAL RVM INSTANCES
scanWaste("ABCD");
