import { supabase } from "../config/supabase.js"

// --- Load Courses ---
const courseList = document.getElementById("courseList")
const courseDetailSection = document.getElementById("courseDetail")

async function loadCourses() {
    const { data, error } = await supabase
        .from("courses")
        .select("*")

    if (error) { console.error(error); return }

    if (courseList) {
        courseList.innerHTML = data.map(course => `
            <div class="course-card">
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <a href="course-detail.html?id=${course.id}">View Course</a>
            </div>
        `).join("")
    }

    if (courseDetailSection) {
        const urlParams = new URLSearchParams(window.location.search)
        const courseId = urlParams.get("id")
        const course = data.find(c => c.id === courseId)
        if (course) {
            courseDetailSection.innerHTML = `
                <h2>${course.title}</h2>
                <p>${course.description}</p>
                <p>Duration: ${course.duration}</p>
                <p>Price: ₦${course.price}</p>
            `
        }
    }
}

loadCourses()

// --- Enrollment Form ---
const enrollmentForm = document.getElementById("enrollmentForm")

if (enrollmentForm) {
    enrollmentForm.addEventListener("submit", async (e) => {
        e.preventDefault()

        const name = document.getElementById("studentName").value
        const email = document.getElementById("studentEmail").value
        const phone = document.getElementById("studentPhone").value
        const fileInput = document.getElementById("paymentProof")
        const paymentFile = fileInput.files[0]
        const urlParams = new URLSearchParams(window.location.search)
        const courseId = urlParams.get("id")

        // Upload payment proof to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from("payment-proofs")
            .upload(`${Date.now()}-${paymentFile.name}`, paymentFile)

        if (uploadError) {
            alert("Payment proof upload failed: " + uploadError.message)
            return
        }

        const paymentUrl = supabase
            .storage
            .from("payment-proofs")
            .getPublicUrl(uploadData.path).publicUrl

        // Insert enrollment record
        const { data, error } = await supabase
            .from("enrollments")
            .insert([
                {
                    student_name: name,
                    email: email,
                    phone: phone,
                    course_id: courseId,
                    payment_proof: paymentUrl,
                    status: "pending"
                }
            ])

        if (error) {
            alert("Enrollment failed: " + error.message)
            return
        }

        alert("Enrollment successful! Check your email and phone for confirmation.")

        // --- Send Email + SMS notifications via Supabase Function ---
        // This part requires Supabase Functions / Edge Functions setup
        await supabase.functions.invoke("send-enrollment-notification", {
            body: { name, email, phone, courseId }
        })

        enrollmentForm.reset()
    })
}
