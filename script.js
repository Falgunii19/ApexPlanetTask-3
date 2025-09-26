
document.addEventListener("DOMContentLoaded", () => {

  const carousel = document.querySelector(".carousel");
  const viewport = document.querySelector(".carousel-viewport");
  const track = document.querySelector(".carousel-track");
  const slides = Array.from(document.querySelectorAll(".carousel-track img"));
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");
  const dotsContainer = document.querySelector(".dots");

  let slideIndex = 0;
  let autoSlideTimer = null;
  const AUTO_DELAY = 3000;

  slides.forEach((_, i) => {
    const btn = document.createElement("button");
    btn.dataset.index = i;
    if (i === 0) btn.classList.add("active");
    btn.addEventListener("click", () => {
      slideIndex = i;
      updateCarousel();
      restartAuto();
    });
    dotsContainer.appendChild(btn);
  });

  function updateCarousel() {
    const slideWidth = viewport.clientWidth;
    track.style.transform = `translateX(${-slideIndex * slideWidth}px)`;
   
    Array.from(dotsContainer.children).forEach((d, i) =>
      d.classList.toggle("active", i === slideIndex)
    );
  }

  function gotoNext() {
    slideIndex = (slideIndex + 1) % slides.length;
    updateCarousel();
  }
  function gotoPrev() {
    slideIndex = (slideIndex - 1 + slides.length) % slides.length;
    updateCarousel();
  }

  nextBtn.addEventListener("click", () => { gotoNext(); restartAuto(); });
  prevBtn.addEventListener("click", () => { gotoPrev(); restartAuto(); });

  window.addEventListener("resize", updateCarousel);

  function startAuto() {
    stopAuto();
    autoSlideTimer = setInterval(() => {
      gotoNext();
    }, AUTO_DELAY);
  }
  function stopAuto() {
    if (autoSlideTimer) clearInterval(autoSlideTimer);
    autoSlideTimer = null;
  }
  function restartAuto() {
    stopAuto();
    startAuto();
  }

  updateCarousel();
  startAuto();



  const questions = [
    {
      q: "What does CSS stand for?",
      options: ["Cascading Style Sheets", "Computer Style System", "Creative Style Setup"],
      answer: 0
    },
    {
      q: "Which tag is used for JavaScript?",
      options: ["<js>", "<script>", "<javascript>"],
      answer: 1
    },
    {
      q: "Which layout helps build responsive components?",
      options: ["Flexbox", "Padding", "Font-size"],
      answer: 0
    }
  ];

  const questionEl = document.getElementById("question");
  const optionsEl = document.getElementById("options");
  const nextBtnQuiz = document.getElementById("nextBtn");
  const feedbackEl = document.getElementById("feedback");
  const finalScoreEl = document.getElementById("finalScore");

  let currentQ = 0;
  let selectedIndex = null;
  let score = 0;
  const answered = new Array(questions.length).fill(false);

  function loadQuestion() {
    selectedIndex = null;
    feedbackEl.textContent = "";
    nextBtnQuiz.disabled = true;
    finalScoreEl.textContent = "";

    const q = questions[currentQ];
    questionEl.textContent = `Q${currentQ + 1}. ${q.q}`;
    optionsEl.innerHTML = "";

    q.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.type = "button";
      btn.textContent = opt;
      btn.dataset.index = i;
      btn.addEventListener("click", () => {
      
        Array.from(optionsEl.children).forEach(x => x.classList.remove("selected"));
        btn.classList.add("selected");
        selectedIndex = i;
        nextBtnQuiz.disabled = false;
        feedbackEl.textContent = `Selected: ${opt}`;
      });
      optionsEl.appendChild(btn);
    });


    nextBtnQuiz.textContent = (currentQ === questions.length - 1) ? "Finish" : "Next";
  }

  nextBtnQuiz.addEventListener("click", () => {
    if (selectedIndex === null) return; 

  
    if (!answered[currentQ]) {
      if (selectedIndex === questions[currentQ].answer) {
        score++;
      }
      answered[currentQ] = true;
    }

  
    currentQ++;
    if (currentQ < questions.length) {
      loadQuestion();
    } else {
      showFinal();
    }
  });

  function showFinal() {
    questionEl.textContent = "Quiz Complete!";
    optionsEl.innerHTML = "";
    nextBtnQuiz.disabled = true;
    feedbackEl.textContent = "";
    finalScoreEl.innerHTML = `Your score: <strong>${score} / ${questions.length}</strong>`;
  
    const restart = document.createElement("button");
    restart.textContent = "Try Again";
    restart.addEventListener("click", resetQuiz);
    finalScoreEl.appendChild(document.createElement("br"));
    finalScoreEl.appendChild(restart);
  }

  function resetQuiz() {
    currentQ = 0;
    score = 0;
    answered.fill(false);
    loadQuestion();
  }


  loadQuestion();



  const placeInput = document.getElementById("placeInput");
  const getWeatherBtn = document.getElementById("getWeatherBtn");
  const weatherResult = document.getElementById("weatherResult");

  async function fetchWeatherForPlace(place) {
    weatherResult.textContent = "Searching place...";
    try {
      const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(place)}&count=1`;
      const geocodeRes = await fetch(geocodeUrl);
      const geocodeData = await geocodeRes.json();

      if (!geocodeData.results || geocodeData.results.length === 0) {
        weatherResult.textContent = `Place not found: "${place}". Try another name.`;
        return;
      }

      const placeData = geocodeData.results[0];
      const lat = placeData.latitude;
      const lon = placeData.longitude;
      const name = `${placeData.name}${placeData.country ? ", " + placeData.country : ""}`;

      weatherResult.textContent = `Fetching weather for ${name} (${lat.toFixed(2)}, ${lon.toFixed(2)})...`;

    
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
      const weatherRes = await fetch(weatherUrl);
      const weatherData = await weatherRes.json();

      if (!weatherData || !weatherData.current_weather) {
        weatherResult.textContent = `Weather data not available for ${name}.`;
        return;
      }

      const cw = weatherData.current_weather;
      const out = [
        `Location: ${name}`,
        `Temperature: ${cw.temperature} °C`,
        `Windspeed: ${cw.windspeed} km/h`,
        `Wind direction: ${cw.winddirection}°`,
        `Time: ${cw.time}`
      ].join(" • ");

      weatherResult.textContent = out;
    } catch (err) {
      console.error(err);
      weatherResult.textContent = "Error fetching weather. Check your connection.";
    }
  }

  getWeatherBtn.addEventListener("click", () => {
    const place = placeInput.value.trim() || "Delhi";
    fetchWeatherForPlace(place);
  });


  placeInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") getWeatherBtn.click();
  });

 
  fetchWeatherForPlace("Delhi");


  
  const jokeEl = document.getElementById("joke");
  const jokeBtn = document.getElementById("jokeBtn");

  async function loadJoke() {
    jokeEl.textContent = "Loading a joke...";
    try {
      const res = await fetch("https://official-joke-api.appspot.com/random_joke");
      const data = await res.json();
      const text = data.setup ? `${data.setup} — ${data.punchline}` : (data.joke || JSON.stringify(data));
      jokeEl.textContent = text;
    } catch (err) {
      jokeEl.textContent = "Couldn't load a joke right now.";
      console.error(err);
    }
  }
  jokeBtn.addEventListener("click", loadJoke);
  loadJoke();

});
