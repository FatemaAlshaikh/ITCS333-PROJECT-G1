document.addEventListener('DOMContentLoaded', () => {
  const addCourseForm = document.getElementById('addCourseForm');
  const courseList = document.getElementById('courseList');
  const fileInput = document.getElementById('fileInput');
  const editIndexInput = document.getElementById('editIndex');
  const formTitle = document.getElementById('formTitle');

  let courses = JSON.parse(localStorage.getItem('courses')) || [];

  function saveCourses() {
    localStorage.setItem('courses', JSON.stringify(courses));
  }

  function renderCourses() {
    courseList.innerHTML = '';
    courses.forEach((course, index) => {
      const courseCard = document.createElement('div');
      courseCard.classList.add('col-md-4', 'mb-4');
      courseCard.innerHTML = `
        <div class="card h-100">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${course.courseName}</h5>
            <p class="card-text">${course.courseDescription}</p>
            <p class="card-text"><small class="text-muted">Uploaded by: ${course.uploaderName}</small></p>
            <button class="btn btn-primary mt-auto mb-2" onclick="showDetails(${index})">View Details</button>
            <button class="btn btn-warning mb-2" onclick="editCourse(${index})">Edit</button>
            <button class="btn btn-danger" onclick="deleteCourse(${index})">Delete</button>
          </div>
        </div>
      `;
      courseList.appendChild(courseCard);
    });
  }

  addCourseForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const courseName = document.getElementById('courseName').value;
    const courseDescription = document.getElementById('courseDescription').value;
    const uploaderName = document.getElementById('uploaderName').value;
    const files = fileInput.files;
    const editIndex = parseInt(editIndexInput.value);

    const filesData = [];

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = function(e) {
        filesData.push({
          name: file.name,
          type: file.type,
          data: e.target.result
        });

        if (filesData.length === files.length) {
          if (editIndex === -1) {
            courses.push({ courseName, courseDescription, uploaderName, files: filesData });
          } else {
            courses[editIndex] = { courseName, courseDescription, uploaderName, files: filesData };
          }
          saveCourses();
          renderCourses();
          resetForm();
        }
      };
      reader.readAsDataURL(file);
    });

    if (files.length === 0) {
      if (editIndex === -1) {
        courses.push({ courseName, courseDescription, uploaderName, files: [] });
      } else {
        courses[editIndex] = { courseName, courseDescription, uploaderName, files: courses[editIndex].files || [] };
      }
      saveCourses();
      renderCourses();
      resetForm();
    }
  });

  function resetForm() {
    addCourseForm.reset();
    editIndexInput.value = -1;
    formTitle.textContent = "Add New Course";
  }

  window.showDetails = function(index) {
    const course = courses[index];
    const modalBody = document.getElementById('modalBody');

    modalBody.innerHTML = `
      <h5>Course Name: ${course.courseName}</h5>
      <p><strong>Description:</strong> ${course.courseDescription}</p>
      <p><strong>Uploaded by:</strong> ${course.uploaderName}</p>
      <div><strong>Files:</strong></div>
      <div class="row mt-2">
        ${course.files.map(file => `
          <div class="col-12 mb-2">
            ${file.type.startsWith('image/') ? `<img src="${file.data}" class="img-fluid rounded" style="max-height: 200px;">`
              : `<a href="${file.data}" download="${file.name}" class="btn btn-outline-primary">${file.name}</a>`}
          </div>
        `).join('')}
      </div>
    `;

    const detailModal = new bootstrap.Modal(document.getElementById('detailModal'));
    detailModal.show();
  }

  window.editCourse = function(index) {
    const course = courses[index];
    document.getElementById('courseName').value = course.courseName;
    document.getElementById('courseDescription').value = course.courseDescription;
    document.getElementById('uploaderName').value = course.uploaderName;
    editIndexInput.value = index;
    formTitle.textContent = "Edit Course";
    window.scrollTo({ top: document.getElementById('addCourse').offsetTop, behavior: 'smooth' });
  }

  window.deleteCourse = function(index) {
    if (confirm('Are you sure you want to delete this course?')) {
      courses.splice(index, 1);
      saveCourses();
      renderCourses();
    }
  }

  // Initial load
  renderCourses();
});
