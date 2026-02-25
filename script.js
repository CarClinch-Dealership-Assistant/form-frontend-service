/*
For Testing Locally modify API_BASE:
Assuming Azure Function is running on http://localhost:7071/
const API_BASE = "http://localhost:7071/api";
*/
// alice: nginx will proxy /api/lead to the function,
// so we can use a relative path here
const API_BASE = "/api/";
const API_ENDPOINT = `${API_BASE}/lead`;

async function loadVehicles() {
    const select = document.getElementById("vehicleId");
    if (!select) return; 

    try {
        const response = await fetch(`${API_BASE}/vehicles`);
        const result = await response.json();

        select.innerHTML = '<option value="">Select a vehicle...</option>';

        result.vehicles.forEach((v) => {
            const option = document.createElement("option");
            option.value = v.id;
            const condition = v.status === 0 ? "New" : "Used";
            option.textContent = `${v.year} ${v.make} ${v.model} ${v.trim || ""} (${condition}), ${parseInt(v.mileage).toLocaleString()} km`;
            select.appendChild(option);
        });
    } catch (err) {
        select.innerHTML = '<option value="">Failed to load vehicles</option>';
        console.error("Failed to load vehicles:", err);
    }
}

// call on page load
loadVehicles();

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.length >= 10;
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + "Error");
    if (field) field.classList.add("input-error");
    if (error) {
        error.textContent = message;
        error.classList.add("show");
    }
}

function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + "Error");
    if (field) field.classList.remove("input-error");
    if (error) error.classList.remove("show");
}


const contactForm = document.getElementById("contactForm");
if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            vehicleId: document.getElementById("vehicleId").value.trim(),
            fname: document.getElementById("fname").value.trim(),
            lname: document.getElementById("lname").value.trim(),
            email: document.getElementById("email").value.trim(),
            phone: document.getElementById("phone").value.trim(),
            notes: document.getElementById("notes").value.trim() || null,
        };

        // validate
        let isValid = true;
        if (!formData.vehicleId) { showError("vehicleId", "Vehicle ID is required"); isValid = false; } else { clearError("vehicleId"); }
        if (formData.fname.length < 2) { showError("fname", "First name must be at least 2 characters"); isValid = false; } else { clearError("fname"); }
        if (formData.lname.length < 2) { showError("lname", "Last name must be at least 2 characters"); isValid = false; } else { clearError("lname"); }
        if (!validateEmail(formData.email)) { showError("email", "Please enter a valid email address"); isValid = false; } else { clearError("email"); }
        if (!validatePhone(formData.phone)) { showError("phone", "Please enter a valid phone number"); isValid = false; } else { clearError("phone"); }

        if (!isValid) return;

        const btn = document.getElementById("submitBtn");
        const btnText = document.getElementById("btnText");
        
        if (btn && btnText) {
            btn.disabled = true;
            btnText.innerHTML = 'Submitting<span class="loading-spinner"></span>';
        }

        try {
            const response = await fetch(API_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                document.getElementById("successMessage").textContent = result.message;
                document.getElementById("successDetails").innerHTML = `
                    <strong>Lead ID:</strong> ${result.data.lead.id}<br>
                    <strong>Vehicle:</strong> ${result.data.vehicle.year} ${result.data.vehicle.make}<br>
                `;
                document.getElementById("overlay").classList.add("show");
                document.getElementById("successModal").classList.add("show");
                contactForm.reset();
            } else {
                throw new Error(result.error || "Submission failed");
            }
        } catch (error) {
            const errorToast = document.getElementById("errorToast");
            const errorText = document.getElementById("errorText");
            if (errorText) errorText.textContent = error.message;
            if (errorToast) {
                errorToast.classList.add("show");
                setTimeout(() => errorToast.classList.remove("show"), 5000);
            }
        } finally {
            if (btn && btnText) {
                btn.disabled = false;
                btnText.textContent = "Submit Inquiry";
            }
        }
    });
}

function closeModal() {
    const overlay = document.getElementById("overlay");
    const modal = document.getElementById("successModal");
    if (overlay) overlay.classList.remove("show");
    if (modal) modal.classList.remove("show");
}

const overlay = document.getElementById("overlay");
if (overlay) {
    overlay.addEventListener("click", closeModal);
}

// Exports needed for jest testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { validateEmail, validatePhone, loadVehicles, closeModal };
}