const request = (arrivalTime, processTime) => {
  return {
    arrivalTime: () => {
      return arrivalTime;
    },
    processTime: () => {
      return processTime;
    }
  };
};

const response = (dropped, startTime) => {
  return {
    dropped: () => {
      return dropped;
    },
    startTime: () => {
      return startTime;
    }
  };
};

const buffer = (bufferSize) => {
  let finishTimes = [];

  return {
    finishTimes: () => {
      return finishTimes;
    },
    process: (request) => {
      // if buffer is empty then just return the start time of this packet & store finish time for this packet
      let arrivalTime = request.arrivalTime();
      let processTime = request.processTime();
      if (finishTimes.length === 0) {
        finishTimes.push(arrivalTime + processTime);
        return response(false, arrivalTime);
      }
      // lets check if we can remove finishTimes which have already been processed
      let i = 0;
      while (finishTimes[i] !== undefined) {
        if (finishTimes[i] <= arrivalTime) {
          finishTimes.splice(i, 1);
        } else {
          break;
        }
      }
      // lets check if buffer is full .. if it is then we class packet as dropped
      if (finishTimes.length === bufferSize) {
        return response(true, -1);
      } else {

        // lets figure out what the start time actually is for this packet
        let startTime;
        // if nothing in buffer then start time is the start time of the request
        if (finishTimes.length === 0) {
          startTime = arrivalTime;
        } else {
          // else start time is the latest finish time
          startTime = finishTimes[finishTimes.length - 1];
        }
        finishTimes.push(startTime + processTime);
        return response(false, startTime);
      }
    }
  };
};

const packageProcessor = () => {

  let bufferSize, numberOfIncomingNetworkPackets;
  let listOfNetworkPackets = [];
  let lineNumber = 0;
  let packageBuffer;
  let responses = [];

  function readLine(line) {
    if (bufferSize === undefined) {
      const firstLine = line.toString().split(' ').map(strToInt);
      bufferSize = firstLine[0];
      packageBuffer = buffer(bufferSize);
      numberOfIncomingNetworkPackets = firstLine[1];
    } else {
      listOfNetworkPackets[lineNumber] = [];
      const packetLine = line.toString().split(' ').map(strToInt);
      listOfNetworkPackets[lineNumber] = request(packetLine[0], packetLine[1]);
      lineNumber += 1;
    }
    if (lineNumber === numberOfIncomingNetworkPackets) {
      run();
    }
  }

  function strToInt(item) {
    return parseInt(item, 10);
  }

  function run() {
    for (let i = 0; i < numberOfIncomingNetworkPackets; i += 1) {
      responses.push(packageBuffer.process(listOfNetworkPackets[i]));
    }
    processResponses();
  }

  function processResponses() {
    for (let i = 0; i < numberOfIncomingNetworkPackets; i += 1) {
      if (responses[i].dropped()) {
        console.log('-1');
      } else {
        console.log(responses[i].startTime());
      }
    }
  }

  return {

    readInput: () => {
      const readline = require('readline');
      process.stdin.setEncoding('utf8');
      var rl = readline.createInterface({
        input: process.stdin,
        terminal: false,
      });
      rl.on('line', readLine);
    },

    start: () => {
      bufferSize = 5;
      numberOfIncomingNetworkPackets = 9;
      listOfNetworkPackets.push(request(0, 1));
      listOfNetworkPackets.push(request(0, 2));
      listOfNetworkPackets.push(request(0, 3));
      listOfNetworkPackets.push(request(1, 1));
      listOfNetworkPackets.push(request(2, 2));
      listOfNetworkPackets.push(request(3, 3));
      listOfNetworkPackets.push(request(6, 1));
      listOfNetworkPackets.push(request(8, 2));
      listOfNetworkPackets.push(request(12, 3));
    }
  
  }
};

packageProcessor().readInput();
