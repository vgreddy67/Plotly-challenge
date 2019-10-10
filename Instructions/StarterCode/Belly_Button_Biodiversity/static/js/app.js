function buildGauge(sample){
  
  var gaugeDiv = d3.select("#gauge");
  
  var data = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value: 450,
      title: { text: "Speed" },
      type: "indicator",
      mode: "gauge+number+delta",
      delta: { reference: 380 },
      gauge: {
        axis: { range: [null, 500] },
        steps: [
          { range: [0, 250], color: "lightgray" },
          { range: [250, 400], color: "gray" }
        ],
        threshold: {
          line: { color: "red", width: 4 },
          thickness: 0.75,
          value: 490
        }
      }
    }
  ];
    
  var layout = { width: 600, height: 450, margin: { t: 0, b: 0 } };
  Plotly.newPlot(gaugeDiv, data, layout);
}

function buildMetadata(sample) {
 
  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
       var spanel = d3.select("#sample-metadata");
       
    // Use `.html("") to clear any existing metadata
        spanel.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    d3.json(`/metadata/${sample}`).then((metaNames) => {
      Object.entries(metaNames).forEach(([key,value]) =>{
        spanel.append('h6').text(`${key}: ${value}`);
        // console.log(key,value);
      });
    })
    // BONUS: Build the Gauge Chart
    buildGauge(sample.WFREQ);
}


function buildCharts(sample) {
  // @TODO: Use `d3.json` to fetch the sample data for the plots
    var surl = `/samples/${sample}`;

    d3.json(surl).then((sampleData) => {
      var otu_ids = sampleData.otu_ids;
      var otu_labels = sampleData.otu_labels;
      var sample_values = sampleData.sample_values;
      
      // @TODO: Build a Bubble Chart using the sample data
      var trace1 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
          size: sample_values,
          color: otu_ids
        }
      };
      
    var data = [trace1];
    
    var layout = {
        title: 'OTU ID',
        showlegend: false,
        margin: { t: 0},
        hovermode: 'closest',
        xaxis: {title: 'OTU ID'}
    }

      // Plotly.plot('bubble', data, layout);
      Plotly.newPlot('bubble', data, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var data = [{
      values: sample_values.slice(0,10),
      labels: otu_ids,
      type: 'pie'
    }];
    
    var layout = {
      height: 400,
      width: 500
    };
    
    Plotly.newPlot('pie', data, layout);
  })
}



function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    // console.log(sampleNames);
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
