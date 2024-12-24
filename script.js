const step1 = document.querySelector(".step1"),
    step2 = document.querySelector(".step2"),
    step3 = document.querySelector(".step3");
emailAddress = document.getElementById("emailAddress"),
    verifyEmail = document.getElementById("verifyEmail"),
    inputs = document.querySelectorAll(".otp-group input"),
    nextButton = document.querySelector(".nextButton"),
    verifyButton = document.querySelector(".verifyButton");

// OTP related variables
let generatedOTP = "";
let userEmail = "";

// Initialize EmailJS
window.addEventListener("load", () => {
    emailjs.init("meAZJfUNbrSaivECX");  // Your User ID
    step1.style.display = "block";
    step2.style.display = "none";
    step3.style.display = "none";
    nextButton.classList.add("disable");
    verifyButton.classList.add("disable");
});

// Email validation
const validateEmail = (email) => {
    let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (re.test(email)) {
        nextButton.classList.remove("disable");
    } else {
        nextButton.classList.add("disable");
    }
};

// Generate OTP (4-digit number)
const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000);  // Random 4-digit OTP
};

// Send OTP to user's email
const sendOTP = () => {
    userEmail = emailAddress.value;
    generatedOTP = generateOTP();  // Generate a new OTP

    let templateParameters = {
        from_name: "OTP Generator", // Sender name (optional)
        OTP: generatedOTP,          // OTP to be sent
        message: "Your OTP code is", // Custom message (optional)
        reply_to: userEmail         // User email to send OTP
    };

    emailjs.send("service_o35jxy5", "template_j7nakoe", templateParameters)
        .then((res) => {
            console.log("OTP sent successfully", res);
            verifyEmail.innerText = userEmail;  // Show the email in step 2
            step1.style.display = "none";  // Hide step 1
            step2.style.display = "block"; // Show step 2
        })
        .catch((err) => {
            console.log("Failed to send OTP", err);
            alert("Failed to send OTP. Please try again.");
        });
};

// OTP input logic (move focus to next input)
inputs.forEach((input, index, inputsArr) => {
    input.addEventListener("input", (e) => {
        if (e.target.value.length === 1 && index < inputsArr.length - 1) {
            inputsArr[index + 1].focus();
        }
    });
    input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && e.target.value.length === 0 && index > 0) {
            inputsArr[index - 1].focus();
        }
    });
});

// Verify OTP entered by the user
const verifyOTP = () => {
    const otpEntered = Array.from(inputs).map(input => input.value).join('');
    if (otpEntered === generatedOTP.toString()) {
        // OTP verified, move to step 3 (success)
        step2.style.display = "none";
        step3.style.display = "block";
    } else {
        // Incorrect OTP
        alert("Invalid OTP. Please try again.");
    }
};

// Event listeners
nextButton.addEventListener("click", sendOTP);  // Send OTP when next is clicked
verifyButton.addEventListener("click", verifyOTP);  // Verify OTP when verify is clicked

// Function to resend OTP if needed
const resendOTP = () => {
    sendOTP();  // Simply call the sendOTP function again to resend the OTP
};
