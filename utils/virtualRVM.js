const axios = require("axios").default;

async function scanWaste(rvmSerial, scrap) {
  try {
    //CAMERA SCAN LOGIC
    let picture = scrap;

    //PROCESSING LOGIC
    let result = [
      "Phone",
      "Laptop",
      "Camera",
      "Adapter",
      "Router",
      "Hard Disk",
      "Electronic Chip",
    ].includes(picture);

    if (result) {
      let reportResponse = await axios.patch(
        `http://localhost:8000/rvm/reportScan/${rvmSerial}`,
        {
          scanResult: result,
          scrapType: "Laptop",
          weight: 10,
        }
      );
      console.log(reportResponse.data);
    }

    //READ RVM status
    let precentage = 20;

    let statusResponse = await axios.patch(
      `http://localhost:8000/rvm/reportStatus/${rvmSerial}`,
      { binGauge: precentage }
    );
    console.log(statusResponse.data);
  } catch (e) {
    console.log(e);
  }
}

//VIRTUAL RVM INSTANCES
scanWaste("ABCD", "Camera");
