const studentRolebtn = document.querySelector('.student');
console.log(studentRolebtn);
const coordinatorRolebtn = document.querySelector('.coordinator');
console.log(coordinatorRolebtn);
let currentRole = 'student';
const loginBtn = document.querySelector('.login-btn')
const studentInput = document.querySelector('.student-div');
console.log(studentInput)
const administratorInput = document.querySelector('.admin-div')
console.log(administratorInput);




(function () {
  const usersKey = "siwesUsers";
  const sessionKey = "siwesCurrentUser";
  const submissionsKey = "siwesProjectSubmissions";

  const defaultUsers = [
    {
      id: "student-demo",
      role: "student",
      fullName: "Judith Azike",
      matricNumber: "CSC/2026/001",
      email: "judith@example.com",
      course: "Computer Science",
      level: "300 Level",
      password: "student123",
      profileImage: "profilepic.jpg",
    },
    {
      id: "admin-demo",
      role: "admin",
      fullName: "SIWES Admin",
      matricNumber: "admin",
      email: "admin@lasued.edu.ng",
      course: "SIWES Coordination",
      level: "Admin",
      password: "admin123",
      profileImage: "logo.png",
    },
  ];

  const defaultSubmissions = [
    {
      id: "demo-1",
      studentId: "student-demo",
      studentName: "Judith Azike",
      matricNumber: "CSC/2026/001",
      department: "Computer Science",
      projectTitle: "SIWES Final Report",
      fileName: "judith-final-report.pdf",
      fileType: "PDF Document",
      fileSize: "2.4 MB",
      submittedAt: "2026-05-20",
      status: "pending",
      comment: "",
    },
    {
      id: "demo-2",
      studentId: "student-demo",
      studentName: "Judith Azike",
      matricNumber: "CSC/2026/001",
      department: "Computer Science",
      projectTitle: "Weekly Logbook",
      fileName: "week-8-logbook.docx",
      fileType: "Word Document",
      fileSize: "1.1 MB",
      submittedAt: "2026-05-18",
      status: "approved",
      comment: "Clear and well arranged weekly activities.",
    },
    {
      id: "demo-3",
      studentId: "student-demo",
      studentName: "Judith Azike",
      matricNumber: "CSC/2026/001",
      department: "Computer Science",
      projectTitle: "Acceptance Letter",
      fileName: "acceptance-letter.jpg",
      fileType: "Image File",
      fileSize: "640 KB",
      submittedAt: "2026-05-17",
      status: "rejected",
      comment: "Image is not clear enough. Upload a readable copy.",
    },
  ];

  // buttons for switching roles
  studentRolebtn.addEventListener('click', function(){
    console.log('i am working')
    currentRole = 'student';
    console.log(currentRole)
    studentInput.classList.remove('hidden');
    console.log(studentInput)
    administratorInput.classList.add('hidden');
    console.log(administratorInput)
  });

  coordinatorRolebtn.addEventListener('click', function(){
    console.log('i am working')
    currentRole = 'coordinator';
    console.log(currentRole);
    administratorInput.classList.remove('hidden');
    console.log(administratorInput)
    studentInput.classList.add('hidden');
    console.log(studentInput)
  });

  function read(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch (error) {
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function seed() {
    if (!localStorage.getItem(usersKey)) {
      write(usersKey, defaultUsers);
    }

    if (!localStorage.getItem(submissionsKey)) {
      write(submissionsKey, defaultSubmissions);
    }
  }

  function getUsers() {
    seed();
    return read(usersKey, []);
  }

  function saveUsers(users) {
    write(usersKey, users);
  }

  function getSubmissions() {
    seed();
    return read(submissionsKey, []);
  }

  function saveSubmissions(submissions) {
    write(submissionsKey, submissions);
  }

  function getCurrentUser() {
    const session = read(sessionKey, null);

    if (!session) {
      return null;
    }

    return getUsers().find((user) => user.id === session.id) || null;
  }

  function setCurrentUser(user) {
    write(sessionKey, { id: user.id, role: user.role });
  }

  function logout() {
    localStorage.removeItem(sessionKey);
    window.location.href = "login.html";
  }

  function login(identifier, password) {
    const cleanedIdentifier = identifier.trim().toLowerCase();
    const user = getUsers().find((item) => {
      return (
        item.password === password &&
        (item.matricNumber.toLowerCase() === cleanedIdentifier ||
          item.email.toLowerCase() === cleanedIdentifier)
      );
    });

    
    if (!user) {
      return null;
    }

    setCurrentUser(user);
    return user;
  }

  function registerStudent(data) {
    const users = getUsers();
    const matricNumber = data.matricNumber.trim();
    const email = data.email.trim().toLowerCase();
    const exists = users.some((user) => {
      return (
        user.matricNumber.toLowerCase() === matricNumber.toLowerCase() ||
        user.email.toLowerCase() === email
      );
    });

    if (exists) {
      throw new Error("This matric number or email has already been registered.");
    }

    const user = {
      id: `student-${Date.now()}`,
      role: "student",
      fullName: data.fullName.trim(),
      matricNumber,
      email,
      course: data.course,
      level: data.level,
      password: data.password,
      profileImage: "profilepic.jpg",
    };

    users.push(user);
    saveUsers(users);
    setCurrentUser(user);

    return user;
  }

  function requireUser(role) {
    const user = getCurrentUser();

    if (!user || (role && user.role !== role)) {
      window.location.href = "login.html";
      return null;
    }

    return user;
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function formatFileSize(bytes) {
    if (bytes < 1024 * 1024) {
      return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function getFileType(fileName) {
    const extension = fileName.split(".").pop().toLowerCase();

    if (extension === "pdf") {
      return "PDF Document";
    }

    if (extension === "doc" || extension === "docx") {
      return "Word Document";
    }

    return "Image File";
  }

  function addSubmission(data) {
    const submissions = getSubmissions();
    const submission = {
      id: `submission-${Date.now()}`,
      studentId: data.studentId,
      studentName: data.studentName,
      matricNumber: data.matricNumber,
      department: data.department,
      projectTitle: data.projectTitle,
      fileName: data.fileName,
      fileType: data.fileType,
      fileSize: data.fileSize,
      submittedAt: new Date().toISOString().slice(0, 10),
      status: "pending",
      comment: "",
    };

    submissions.unshift(submission);
    saveSubmissions(submissions);

    return submission;
  }

  function updateSubmission(id, updates) {
    const submissions = getSubmissions().map((submission) => {
      if (submission.id !== id) {
        return submission;
      }

      return {
        ...submission,
        ...updates,
        reviewedAt: new Date().toISOString().slice(0, 10),
      };
    });

    saveSubmissions(submissions);
    return submissions.find((submission) => submission.id === id);
  }

  function getStudentSubmissions(user) {
    return getSubmissions().filter((submission) => {
      return (
        submission.studentId === user.id ||
        submission.matricNumber.toLowerCase() === user.matricNumber.toLowerCase()
      );
    });
  }

  function getAnalysis(submission) {
    const fileName = submission.fileName.toLowerCase();
    const isReport = submission.projectTitle.toLowerCase().includes("report");
    const isReadableFormat = /\.(pdf|doc|docx|jpg|jpeg|png)$/i.test(fileName);
    const hasStudentId = Boolean(submission.matricNumber);
    const score =
      55 + (isReadableFormat ? 15 : 0) + (hasStudentId ? 15 : 0) + (isReport ? 10 : 5);

    return {
      score: Math.min(score, 95),
      points: [
        isReadableFormat
          ? "File format is accepted for SIWES review."
          : "File format should be PDF, DOCX, JPG or PNG.",
        hasStudentId
          ? "Student identity is attached to the submission."
          : "Student identity needs to be confirmed.",
        isReport
          ? "Final report should be checked for abstract, weekly activities and conclusion."
          : "Document should be checked against its required SIWES template.",
      ],
    };
  }
  loginBtn.addEventListener('click', function() {
    let identifier, password;
  
    if (currentRole === 'student') {
      identifier = document.querySelector('#matric-input').value;
      password = document.querySelector('#student-password').value;
    } else {
      identifier = document.querySelector('#email-input').value;
      password = document.querySelector('#coordinator-password').value;
    }
  
    const user = SIWES.login(identifier, password);
  
    if (!user) {
      alert('Invalid credentials');
      return;
    }
  
    if (user.role === 'student') {
      window.location.href = 'studentdashboard.html';
    } else {
      window.location.href = 'coordinatordash.html'; // or admin dashboard
    }
  });

  window.SIWES = {
    seed,
    login,
    logout,
    requireUser,
    getCurrentUser,
    registerStudent,
    getSubmissions,
    saveSubmissions,
    addSubmission,
    updateSubmission,
    getStudentSubmissions,
    formatDate,
    formatFileSize,
    getFileType,
    getAnalysis,
  };

  seed();
})();
