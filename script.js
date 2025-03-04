document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.slick-track');
  const slides = Array.from(track.children);
  const nextButton = document.querySelector('.slick-next');
  const prevButton = document.querySelector('.slick-prev');

  let currentSlide = 0;

  const slideWidth = slides[0].getBoundingClientRect().width;
  slides.forEach((slide, index) => {
    slide.style.left = `${slideWidth * index}px`;
  });

  const moveToSlide = (currentIndex) => {
    const targetPosition = slides[currentIndex].style.left;
    track.style.transform = `translateX(-${targetPosition})`;
  };

  // Move to the next slide
  nextButton.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % slides.length;
    moveToSlide(currentSlide);
  });

  // Move to the previous slide
  prevButton.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    moveToSlide(currentSlide);
  });
});



document.addEventListener('DOMContentLoaded', () => {
  let time = 5 * 60 * 1000; // 5 minutes in milliseconds
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const millisecondsEl = document.getElementById('milliseconds');

  const updateTimer = () => {
    const minutes = Math.floor(time / (60 * 1000));
    const seconds = Math.floor((time % (60 * 1000)) / 1000);
    const milliseconds = time % 1000;

    minutesEl.textContent = minutes.toString().padStart(2, '0');
    secondsEl.textContent = seconds.toString().padStart(2, '0');
    millisecondsEl.textContent = milliseconds.toString().padStart(2, '0');

    if (time > 0) {
      time -= 10; // Decrement by 10ms for smoother updates
    } else {
      clearInterval(timerInterval);
    }
  };

  const timerInterval = setInterval(updateTimer, 10); // Update every 10ms
  updateTimer();
});



document.addEventListener("DOMContentLoaded", () => {
  const accordionItems = document.querySelectorAll(".accordion-item");

  accordionItems.forEach((item) => {
    const title = item.querySelector(".accordion-title");
    const content = item.querySelector(".accordion-content");

    title.addEventListener("click", () => {
      const isActive = item.classList.contains("active");
      document.querySelectorAll(".accordion-item").forEach((el) => {
        el.classList.remove("active");
        el.querySelector(".accordion-content").style.display = "none";
      });

      if (!isActive) {
        item.classList.add("active");
        content.style.display = "block";
      }
    });
  });
});


document.addEventListener("DOMContentLoaded", function () {
  const accordionItems = document.querySelectorAll(".accordion-item");

  accordionItems.forEach((item) => {
    const title = item.querySelector(".accordion-title");

    title.addEventListener("click", () => {
      const content = item.querySelector(".accordion-content");

      // If the content is already open, close it
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
        content.style.transition = "max-height 0.3s ease-out";
      } else {
        // Close all other accordion items
        accordionItems.forEach((otherItem) => {
          const otherContent = otherItem.querySelector(".accordion-content");
          if (otherContent !== content) {
            otherContent.style.maxHeight = null;
          }
        });

        // Open the clicked accordion item
        content.style.maxHeight = content.scrollHeight + "px";
        content.style.transition = "max-height 0.3s ease-out";
      }
    });
  });
});


// Collect user interaction data
const interactionData = [];

// Track scrolling
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const timestamp = new Date().toISOString();
  interactionData.push({ type: 'scroll', value: scrollTop, timestamp });
});

// Track button clicks
document.querySelectorAll('.btn, .moving-btn, .openModal').forEach((button) => {
  button.addEventListener('click', (event) => {
    const timestamp = new Date().toISOString();
    interactionData.push({ type: 'click', element: event.target.innerText, timestamp });
  });
});

// Send data to server periodically
setInterval(() => {
  if (interactionData.length > 0) {
    fetch('/save-interactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(interactionData),
    })
    .then(() => {
      // Clear the sent data
      interactionData.length = 0;
    })
    .catch((error) => console.error('Error sending interaction data:', error));
  }
}, 5000);


paypal.Buttons({
  createOrder: function (data, actions) {
    const email = document.getElementById("customer-email").value;

    if (!email || !email.includes("@")) {
      alert("Please enter a valid email before proceeding.");
      return actions.reject();
    }

    return actions.order.create({
      purchase_units: [{
        amount: { value: "490.00" }, // Set price
      }],
    });
  },
  onApprove: function (data, actions) {
    return actions.order.capture().then(() => {
      const email = document.getElementById("customer-email").value;

      // Send email to backend for processing
      fetch("/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }), // Send email in request body
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Backend response:", data);
          alert("Payment successful! Check your email.");
          window.location.href = "success.html";
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Payment successful, but there was an issue sending the email.");
        });
    });
  },
}).render("#paypal-button-container");
