const axios = require("axios").default;

async function scanWaste(nodeSerial) {
  try {
    let getResponse = await axios.get(
      `http://localhost:8000/rvm/${nodeSerial}`
    );
    //PROCESSING LOGIC

    let putResponse = await axios.put(
      `http://localhost:8000/rvm/${nodeSerial}`,
      {
          
      }
    );
    // axios
    //   .post(`http://localhost:8000/rvm/${nodeSerial}`, {
    //     nodeSerial: nodeSerial,
    //     temperature: noiseOffset(31.51, 20, noiseStep, [27, 45]),
    //     spo2: noiseOffset(90, 20, noiseStep, [0, 100]),
    //     hr: noiseOffset(60, 20, noiseStep, [60, 200]),
    //     lat: 14.837921,
    //     lng: 120.792356,
    //     date: `${
    //       datetime.getMonth() + 1
    //     }/${datetime.getDate()}/${datetime.getYear()}`,
    //     time: `${
    //       datetime.getHours() + 1
    //     }:${datetime.getMinutes()}:${datetime.getSeconds()}`,
    //     cough: "0",
    //     ir: noiseOffset(203177, 1000, noiseStep, [0, 250000]),
    //     battery: 99,
    //   })
    //   .then(function (response) {
    //     console.log(response.data);
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   });
  } catch (e) {
    console.log(e);
  }
}

//VIRTUAL NODE INSTANCES
scanWaste("ABCD");
