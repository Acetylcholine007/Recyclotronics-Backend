const axios = require("axios").default;
// const URL = "https://recyclotronics.herokuapp.com";
const URL = "http://localhost:8000";

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

    //INITIALIZATION LOGIC (TESTING PURPOSE ONLY)
    // let initializationResponse = await axios.patch(
    //   `${URL}/rvm/initiateScan/${rvmSerial}`,
    //   {},
    //   {
    //     headers: {
    //       Authorization:
    //         "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1vcnR5QGdtYWlsLmNvbSIsInVzZXJJZCI6IjYyNDY2YjMyMTU2Nzk2NjkzYmU1ZTUzNiIsImFjY291bnRUeXBlIjoxLCJpYXQiOjE2NDkwNzM0ODJ9.85z5mWM3N_DXiAsE2zcjDDbNYJ_auJzD0OcVI7R67YA",
    //     },
    //   }
    // );
    // console.log(initializationResponse.data);

    //SENDING LOGIC
    let reportResponse = await axios.patch(
      `${URL}/rvm/reportScan/${rvmSerial}`,
      {
        scanResult: result,
        scrapType: result ? picture : "Unidentified",
        weight: 10,
      }
    );
    console.log(reportResponse.data);

    //READ RVM status
    let precentage = 20;

    let statusResponse = await axios.patch(
      `${URL}/rvm/reportStatus/${rvmSerial}`,
      { binGauge: precentage }
    );
    console.log(statusResponse.data);
  } catch (e) {
    console.log(e);
  }
}

//VIRTUAL RVM INSTANCES
scanWaste("ABCD", "Camera");
