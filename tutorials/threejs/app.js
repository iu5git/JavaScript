import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const PRESETS = [
  { id: 1, title: "Машина", model: "models/Range Rover.glb" },
  { id: 3, title: "Дерево", model: "models/Big Tree.glb" },
  { id: 4, title: "Пальма", model: "models/Palm Tree.glb" },
  { id: 5, title: "Машина + Дерево", models: [
      { model: "models/Range Rover.glb" },
      { model: "models/Big Tree.glb" },
    ]
  }
];

let userModels = [];
const cardList = document.getElementById('card-list');

// Загружаем пользовательские модели из IndexedDB при загрузке страницы
getAllModelsFromDB().then(models => {
  userModels = models;
  renderCards();
});

function renderCards() {
  cardList.innerHTML = '';
  PRESETS.forEach(model => addCard(model, false, model.id));
  userModels.forEach(model => addCard(model, true, model.id));
}

// --- ГЛАВНАЯ ФУНКЦИЯ СОЗДАНИЯ КАРТОЧКИ С ПРЕВЬЮ ---
function addCard(model, isUser, userId) {
  const card = document.createElement('div');
  card.className = 'card';
  card.tabIndex = 0;

  // --- Canvas-превью ---
  const previewCanvas = document.createElement('canvas');
  previewCanvas.className = 'preview-canvas';
  previewCanvas.width = 140;
  previewCanvas.height = 140;
  card.appendChild(previewCanvas);

  // Рендер превью модели в canvas
  renderPreviewModelToCanvas(model, isUser, previewCanvas);

  const title = document.createElement('div');
  title.className = 'card-title';
  title.textContent = model.title || 'Загруженная модель';
  card.appendChild(title);

  card.onclick = () => {
    if (isUser) {
      window.location.href = `detail.html?user=${userId}`;
    } else {
      window.location.href = `detail.html?id=${model.id}`;
    }
  };

  cardList.appendChild(card);
}

// --- РЕНДЕР ПРЕВЬЮ-МОДЕЛИ В CANVAS (одиночные и парные) ---
function renderPreviewModelToCanvas(model, isUser, canvas) {
  // теперь можно использовать THREE и GLTFLoader напрямую!
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setClearColor(0xe6ebf5, 1);
  renderer.setSize(canvas.width, canvas.height, false);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.width / canvas.height, 0.1, 1000);
  camera.position.set(0, 0.7, 2);

  scene.add(new THREE.AmbientLight(0xffffff, 1));
  const light = new THREE.DirectionalLight(0xffffff, 0.8);
  light.position.set(2, 6, 4);
  scene.add(light);

  const loader = new GLTFLoader();

  function normalizeModelToFloor(obj) {
    const box = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    // Центрируем по X и Z, а по Y опускаем низ на уровень пола (y = 0)
    obj.position.x -= center.x;
    obj.position.z -= center.z;
    obj.position.y -= box.min.y;
    // Масштабируем чтобы модель умещалась в предпросмотр
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) obj.scale.multiplyScalar(1.1 / maxDim);
  }


  if (isUser && model.buffer) {
    loader.parse(model.buffer, '', gltf => {
      const obj = gltf.scene;
      normalizeModelToFloor(obj);
      scene.add(obj);
      renderer.render(scene, camera);
    }, err => {
      drawFallback(canvas);
    });
  } else if (model.model) {
    loader.load(model.model, gltf => {
      const obj = gltf.scene;
      normalizeModelToFloor(obj);
      scene.add(obj);
      renderer.render(scene, camera);
    }, undefined, err => {
      drawFallback(canvas);
    });
  } else if (model.models && Array.isArray(model.models)) {
    const gap = 0.6;
    let loaded = 0;
    model.models.forEach((m, idx) => {
      loader.load(m.model, gltf => {
        const obj = gltf.scene;
        normalizeModelToFloor(obj);
        obj.position.x = idx === 0 ? -gap : gap;
        scene.add(obj);
        loaded++;
        if (loaded === 2) renderer.render(scene, camera);
      }, undefined, err => {
        loaded++;
        if (loaded === 2) renderer.render(scene, camera);
      });
    });
  } else {
    drawFallback(canvas);
  }

  function drawFallback(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = "#dde6f2";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "56px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#666";
    ctx.fillText("🧩", canvas.width / 2, canvas.height / 2);
  }

}

// --- ЗАГРУЗКА ПОЛЬЗОВАТЕЛЬСКИХ МОДЕЛЕЙ ---
const uploadInput = document.getElementById('uploadModel');
uploadInput.addEventListener('change', (event) => {
  const files = Array.from(event.target.files);
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = function(e) {
      const modelObj = {
        title: file.name,
        buffer: e.target.result,
        filename: file.name
      };
      addModelToDB(modelObj).then(id => {
        modelObj.id = id;
        userModels.push(modelObj);
        renderCards();
      });
    };
    reader.readAsArrayBuffer(file);
  });
});
