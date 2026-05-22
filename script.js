let defaultStudents = [
    { id: 1, name: 'Đậu Thiên An', images: [] },
    { id: 2, name: 'Nguyễn Đình Bảo', images: [] },
    { id: 3, name: 'Nguyễn Sỹ Bảo', images: [] },
    { id: 4, name: 'Nguyễn Văn Gia Bảo', images: [] },
    { id: 5, name: 'Nguyễn Hữu Xuân Bắc', images: [] },
    { id: 6, name: 'Phạm Hải Châu', images: [] },
    { id: 7, name: 'Lê Quốc Chung', images: [] },
    { id: 8, name: 'Nguyễn Thị Quỳnh Diệp', images: [] },
    { id: 9, name: 'Nguyễn Thị Hạnh Dung', images: [] },
    { id: 10, name: 'Võ Mạnh Dũng', images: [] },
    { id: 11, name: 'Nguyễn Trần An Đông', images: [] },
    { id: 12, name: 'Cấn Văn Hiếu', images: [] },
    { id: 13, name: 'Trần Nguyên Hiếu', images: [] },
    { id: 14, name: 'Lê Văn Hợp', images: [] },
    { id: 15, name: 'Nguyễn Xuân Khánh Huy', images: [] },
    { id: 16, name: 'Doãn Thị Khánh Huyền', images: [] },
    { id: 17, name: 'Nguyễn Bá Huỳnh', images: [] },
    { id: 18, name: 'Nguyễn Ngọc Vân Khánh', images: [] },
    { id: 19, name: 'Trần Hải Khánh', images: [] },
    { id: 20, name: 'Lê Xuân Kiên', images: [] },
    { id: 21, name: 'Nguyễn Trần Trung Kiên', images: [] },
    { id: 22, name: 'Vương Đình Kiên', images: [] },
    { id: 23, name: 'Nguyễn Khánh Linh', images: [] },
    { id: 24, name: 'Nguyễn Kiều Linh', images: [] },
    { id: 25, name: 'Phan Thị Ái Linh', images: [] },
    { id: 26, name: 'Nguyễn Thị Xuân Mai', images: [] },
    { id: 27, name: 'Nguyễn Hoàng Mạnh', images: [] },
    { id: 28, name: 'Trịnh Anh Minh', images: [] },
    { id: 29, name: 'Nguyễn Thảo My', images: [] },
    { id: 30, name: 'Phạm Thị Trà My', images: [] },
    { id: 31, name: 'Hoàng Lê Na', images: [] },
    { id: 32, name: 'Uông Việt Nhân', images: [] },
    { id: 33, name: 'Nguyễn Phi Bảo Nhi', images: [] },
    { id: 34, name: 'Nguyễn Thảo Nhi', images: [] },
    { id: 35, name: 'Phạm Thị Thục Nhi', images: [] },
    { id: 36, name: 'Vương Thị Yến Nhi', images: [] },
    { id: 37, name: 'Nguyễn Thị Tâm', images: [] },
    { id: 38, name: 'Nguyễn Văn Thành', images: [] },
    { id: 39, name: 'Nguyễn Minh Thắng', images: [] },
    { id: 40, name: 'Lê Thùy Trang', images: [] },
    { id: 41, name: 'Vương Huyền Trang', images: [] },
    { id: 42, name: 'Lê Văn Trung', images: [] },
    { id: 43, name: 'Nguyễn Bá Tuấn', images: [] },
    { id: 44, name: 'Trần Thanh Tuyền', images: [] },
    { id: 45, name: 'Nguyễn Thị Hà Vy', images: [] },
    { id: 46, name: 'Nguyễn Minh Hoàn', images: [] }
];

let students = JSON.parse(localStorage.getItem('students')) || [];
let qrCodeInstance = null;
let currentZoom = 100;
let currentImageIndex = 0;
let currentStudentImages = [];
let currentStudentName = '';
let currentStudentId = null;
let currentRotation = 0;

document.addEventListener('DOMContentLoaded', function() {
    initializeStudents();
    checkViewMode();
    renderStudentList();
    setupEventListeners();
});

function initializeStudents() {
    if (students.length === 0) {
        students = defaultStudents.map((student, index) => ({
            ...student,
            id: Date.now() + index,
            images: []
        }));
        saveStudents();
    } else {
        students = students.map(s => ({
            ...s,
            images: s.images || []
        }));
        saveStudents();
    }
}

function checkViewMode() {
    const urlParams = new URLSearchParams(window.location.search);
    const viewMode = urlParams.get('view');
    
    if (viewMode === 'parent') {
        showParentView();
    } else {
        showTeacherView();
    }
}

function showTeacherView() {
    document.getElementById('teacherView').classList.remove('hidden');
    document.getElementById('parentView').classList.add('hidden');
    renderStudentList();
    generateQRCode();
}

function showParentView() {
    document.getElementById('teacherView').classList.add('hidden');
    document.getElementById('parentView').classList.remove('hidden');
    renderParentStudentList();
}

function setupEventListeners() {
    document.getElementById('addStudentForm').addEventListener('submit', addStudent);
    document.getElementById('generateQRBtn').addEventListener('click', generateQRCode);
    document.getElementById('backToTeacherBtn').addEventListener('click', function() {
        window.location.search = '';
    });
    
    const modal = document.getElementById('imageModal');
    const closeBtn = document.querySelector('.close');
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    };
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
    
    document.getElementById('zoomInBtn').addEventListener('click', zoomIn);
    document.getElementById('zoomOutBtn').addEventListener('click', zoomOut);
    document.getElementById('resetZoomBtn').addEventListener('click', resetZoom);
    document.getElementById('prevImageBtn').addEventListener('click', prevImage);
    document.getElementById('nextImageBtn').addEventListener('click', nextImage);
    document.getElementById('rotateLeftBtn').addEventListener('click', rotateLeft);
    document.getElementById('rotateRightBtn').addEventListener('click', rotateRight);
    document.getElementById('saveRotationBtn').addEventListener('click', saveRotatedImage);
}

function addStudent(e) {
    e.preventDefault();
    
    const nameInput = document.getElementById('studentName');
    const imageInput = document.getElementById('studentImage');
    
    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const student = {
                id: Date.now(),
                name: nameInput.value,
                images: [e.target.result]
            };
            
            students.push(student);
            saveStudents();
            renderStudentList();
            
            nameInput.value = '';
            imageInput.value = '';
        };
        reader.readAsDataURL(imageInput.files[0]);
    }
}

function saveStudents() {
    localStorage.setItem('students', JSON.stringify(students));
}

function renderStudentList() {
    const container = document.getElementById('studentList');
    container.innerHTML = '';
    
    students.forEach(student => {
        const card = document.createElement('div');
        card.className = 'student-card';
        const imageCount = student.images ? student.images.length : 0;
        card.innerHTML = `
            <h4>${student.name}</h4>
            <span style="color: ${imageCount > 0 ? '#28a745' : '#dc3545'}; font-size: 0.9em;">
                ${imageCount} ảnh
            </span>
            <div class="card-actions">
                <button class="view-btn" onclick="document.getElementById('imageInput_${student.id}').click()" style="background: #17a2b8;">Thêm Ảnh</button>
                <input type="file" id="imageInput_${student.id}" accept="image/*" style="display: none;" onchange="addImageToStudent(${student.id}, this)" multiple>
                ${imageCount > 0 ? `<button class="view-btn" onclick="openImageModal('${student.id}')">Xem</button>` : ''}
                <button class="delete-btn" onclick="deleteStudent(${student.id})">Xóa</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function compressImage(src, quality = 0.6, maxWidth = 1200, callback) {
    const img = new Image();
    img.onload = function() {
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        callback(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = src;
}

function addImageToStudent(id, input) {
    if (!input.files || input.files.length === 0) {
        return;
    }
    
    const student = students.find(s => s.id == id);
    if (!student) {
        alert('Không tìm thấy học sinh!');
        return;
    }
    
    if (!student.images) {
        student.images = [];
    }
    
    let filesProcessed = 0;
    const totalFiles = input.files.length;
    
    for (let i = 0; i < totalFiles; i++) {
        const reader = new FileReader();
        reader.onload = function(e) {
            compressImage(e.target.result, 0.5, 1000, function(compressedSrc) {
                student.images.push(compressedSrc);
                filesProcessed++;
                if (filesProcessed >= totalFiles) {
                    try {
                        saveStudents();
                        renderStudentList();
                    } catch (err) {
                        alert('Dung lượng lưu trữ đầy! Vui lòng xóa bớt ảnh cũ.');
                    }
                }
            });
        };
        reader.readAsDataURL(input.files[i]);
    }
}

function renderParentStudentList() {
    const container = document.getElementById('parentStudentList');
    container.innerHTML = '';
    
    students.forEach(student => {
        const imageCount = student.images ? student.images.length : 0;
        if (imageCount > 0) {
            const card = document.createElement('div');
            card.className = 'student-card';
            card.innerHTML = `
                <h4>${student.name}</h4>
                <span style="color: #28a745; font-size: 0.9em;">
                    ${imageCount} ảnh
                </span>
            `;
            card.onclick = function() {
                openImageModal(student.id);
            };
            container.appendChild(card);
        }
    });
}

function deleteStudent(id) {
    if (confirm('Bạn có chắc muốn xóa học sinh này?')) {
        students = students.filter(s => s.id !== id);
        saveStudents();
        renderStudentList();
    }
}

function openImageModal(studentId) {
    const student = students.find(s => s.id == studentId);
    if (!student || !student.images || student.images.length === 0) {
        alert('Chưa có ảnh cho học sinh này!');
        return;
    }
    
    currentStudentImages = student.images;
    currentStudentName = student.name;
    currentStudentId = studentId;
    currentImageIndex = 0;
    currentRotation = 0;
    
    const modal = document.getElementById('imageModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalImage = document.getElementById('modalImage');
    const imageCounter = document.getElementById('imageCounter');
    
    modalTitle.textContent = currentStudentName;
    modalImage.src = currentStudentImages[0];
    modalImage.style.transform = 'rotate(0deg)';
    imageCounter.textContent = `1 / ${currentStudentImages.length}`;
    modal.style.display = 'block';
    resetZoom();
    updateNavButtons();
}

function prevImage() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        updateModalImage();
    }
}

function nextImage() {
    if (currentImageIndex < currentStudentImages.length - 1) {
        currentImageIndex++;
        updateModalImage();
    }
}

function updateModalImage() {
    const modalImage = document.getElementById('modalImage');
    const imageCounter = document.getElementById('imageCounter');
    
    modalImage.src = currentStudentImages[currentImageIndex];
    modalImage.style.transform = 'rotate(0deg)';
    currentRotation = 0;
    imageCounter.textContent = `${currentImageIndex + 1} / ${currentStudentImages.length}`;
    resetZoom();
    updateNavButtons();
}

function rotateLeft() {
    currentRotation -= 90;
    updateImageRotation();
}

function rotateRight() {
    currentRotation += 90;
    updateImageRotation();
}

function updateImageRotation() {
    const modalImage = document.getElementById('modalImage');
    modalImage.style.transform = `rotate(${currentRotation}deg)`;
}

function saveRotatedImage() {
    if (currentRotation === 0) {
        alert('Ảnh chưa được xoay!');
        return;
    }
    
    const modalImage = document.getElementById('modalImage');
    const img = new Image();
    img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const rad = (currentRotation % 360) * Math.PI / 180;
        
        if (Math.abs(currentRotation % 180) === 90) {
            canvas.width = img.height;
            canvas.height = img.width;
        } else {
            canvas.width = img.width;
            canvas.height = img.height;
        }
        
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(rad);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        
        const rotatedSrc = canvas.toDataURL('image/jpeg', 0.95);
        const student = students.find(s => s.id == currentStudentId);
        if (student) {
            student.images[currentImageIndex] = rotatedSrc;
            saveStudents();
            currentStudentImages = student.images;
            currentRotation = 0;
            modalImage.src = rotatedSrc;
            modalImage.style.transform = 'rotate(0deg)';
            alert('Đã lưu ảnh xoay!');
        }
    };
    img.src = currentStudentImages[currentImageIndex];
}

function updateNavButtons() {
    document.getElementById('prevImageBtn').disabled = currentImageIndex === 0;
    document.getElementById('nextImageBtn').disabled = currentImageIndex === currentStudentImages.length - 1;
}

function zoomIn() {
    currentZoom += 25;
    updateZoom();
}

function zoomOut() {
    if (currentZoom > 25) {
        currentZoom -= 25;
        updateZoom();
    }
}

function resetZoom() {
    currentZoom = 100;
    updateZoom();
}

function updateZoom() {
    const modalImage = document.getElementById('modalImage');
    const zoomLevel = document.getElementById('zoomLevel');
    modalImage.style.transform = `scale(${currentZoom / 100})`;
    zoomLevel.textContent = currentZoom + '%';
}

function generateQRCode() {
    const qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = '';
    
    const parentUrl = window.location.origin + window.location.pathname + '?view=parent';
    
    qrCodeInstance = new QRCode(qrContainer, {
        text: parentUrl,
        width: 200,
        height: 200,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });
}
