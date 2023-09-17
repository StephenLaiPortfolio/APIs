import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to parse JSON requests
app.use(express.json());

// Render the initial form
app.get('/', async (req, res) => {
  try {
   
    const response = await axios.get('https://ai-weather-by-meteosource.p.rapidapi.com/current', {
  
    params: {
      lat: '25.0330',
      lon: '121.5654',
      timezone: 'auto',
      language: 'en',
      units: 'us'
    },
    headers: {
      'X-RapidAPI-Key': 'e1fa23a977mshf76809386b9af3cp1b9a03jsn65c83bb87621',
      'X-RapidAPI-Host': 'ai-weather-by-meteosource.p.rapidapi.com'
    }
  });
 
const weather = response.data;
console.log(weather);
const summary = weather.current.summary;
const temp = weather.current.temperature;
res.render("index.ejs",{summary, temp});
} catch (error) {
  console.error(error);
}
  
});

// Handle the POST request to convert currency
app.post('/convert', async (req, res) => {
  try {
    const { amount } = req.body;

    const response = await axios.get('https://currency-converter5.p.rapidapi.com/currency/convert', {
      params: {
        format: 'json',
        from: 'USD',
        to: 'TWD',
        amount: amount,
        language: 'en'
      },
      headers: {
        'X-RapidAPI-Key': 'e1fa23a977mshf76809386b9af3cp1b9a03jsn65c83bb87621',
        'X-RapidAPI-Host': 'currency-converter5.p.rapidapi.com'
      }
    });

    const result = response.data;

    if (result && result.rates && result.rates.TWD && result.rates.TWD.rate_for_amount) {
      const convertedAmount = result.rates.TWD.rate_for_amount;

      res.render("index.ejs", { convertedAmount });
    } else {
      console.error("Currency conversion response format is unexpected:", result);
      res.status(500).send("Currency conversion response format is unexpected.");
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("An error occurred.");
  }
});

app.get('/hotel', async (req, res) => {
  try {
   
const booking = await axios.get('https://best-booking-com-hotel.p.rapidapi.com/booking/best-accommodation',{
  params: {
    cityName: 'Taipei',
    countryName: 'Taiwan'
  },
  headers: {
    'X-RapidAPI-Key': '9a39a7f7demsh55f5ed1687f091dp165363jsnc7a977e16659',
    'X-RapidAPI-Host': 'best-booking-com-hotel.p.rapidapi.com'
  }

});

const hotelName = booking.data.name;
const hotelLink = booking.data.link;
res.render("index.ejs",{hotelName, hotelLink});
    

  } catch (error) {
    console.error(error);
  }
});








// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
