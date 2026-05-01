// Three.jsの基本設定
let scene, camera, renderer, uniform;
let uniformMesh;
let autoRotate = true;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let uniformRotation = { x: 0, y: 0 };

// デザインテンプレート（パターン）
const designTemplates = {
    custom: { name: 'カスタム', color: '#FF0000', pattern: 'solid', patternDetail: {} },
    design_1: { name: 'デザイン1 - 無地', color: '#FF0000', pattern: 'solid', patternDetail: {} },
    design_2: { name: 'デザイン2 - 細縦ストライプ', color: '#0066FF', pattern: 'vertical_stripes', patternDetail: { width: 2, spacing: 8 } },
    design_3: { name: 'デザイン3 - 太縦ストライプ', color: '#000000', pattern: 'vertical_stripes', patternDetail: { width: 4, spacing: 12 } },
    design_4: { name: 'デザイン4 - 横線', color: '#00AA00', pattern: 'horizontal_lines', patternDetail: { width: 2, spacing: 10 } },
    design_5: { name: 'デザイン5 - 小市松模様', color: '#7700AA', pattern: 'checkerboard', patternDetail: { size: 8 } },
    design_6: { name: 'デザイン6 - 大市松模様', color: '#FF8800', pattern: 'checkerboard', patternDetail: { size: 16 } },
    design_7: { name: 'デザイン7 - ドット', color: '#FF1493', pattern: 'dots', patternDetail: { size: 6, spacing: 12 } },
    design_8: { name: 'デザイン8 - 細ドット', color: '#000080', pattern: 'dots', patternDetail: { size: 3, spacing: 8 } },
    design_9: { name: 'デザイン9 - ジグザグ', color: '#808080', pattern: 'zigzag', patternDetail: { amplitude: 5, frequency: 4 } },
    design_10: { name: 'デザイン10 - 斜線', color: '#CC0000', pattern: 'diagonal_lines', patternDetail: { width: 2, spacing: 10, angle: 45 } },
    design_11: { name: 'デザイン11 - 逆斜線', color: '#FFFFFF', pattern: 'diagonal_lines', patternDetail: { width: 2, spacing: 10, angle: -45 } },
    design_12: { name: 'デザイン12 - グラデーション', color: '#FFDD00', pattern: 'gradient', patternDetail: { direction: 'vertical' } },
    design_13: { name: 'デザイン13 - 波線', color: '#330066', pattern: 'wave', patternDetail: { amplitude: 4, frequency: 6 } },
    design_14: { name: 'デザイン14 - クロス', color: '#CC5500', pattern: 'cross', patternDetail: { spacing: 16 } },
    design_15: { name: 'デザイン15 - 細横線', color: '#000000', pattern: 'horizontal_lines', patternDetail: { width: 1, spacing: 6 } },
    design_16: { name: 'デザイン16 - 太横線', color: '#228B22', pattern: 'horizontal_lines', patternDetail: { width: 4, spacing: 12 } },
    design_17: { name: 'デザイン17 - シンプルストライプ', color: '#4B0082', pattern: 'vertical_stripes', patternDetail: { width: 3, spacing: 10 } },
    design_18: { name: 'デザイン18 - ダイヤ模様', color: '#990033', pattern: 'diamond', patternDetail: { size: 12 } },
    design_19: { name: 'デザイン19 - ハニカム', color: '#00CCAA', pattern: 'honeycomb', patternDetail: { size: 10 } },
    design_20: { name: 'デザイン20 - トリプルストライプ', color: '#800000', pattern: 'triple_stripes', patternDetail: { width: 2, spacing: 6 } },
    design_21: { name: 'デザイン21 - 大ドット', color: '#6A5ACD', pattern: 'dots', patternDetail: { size: 10, spacing: 20 } },
    design_22: { name: 'デザイン22 - 細波線', color: '#FF4500', pattern: 'wave', patternDetail: { amplitude: 2, frequency: 8 } },
    design_23: { name: 'デザイン23 - ティアドロップ', color: '#004400', pattern: 'teardrop', patternDetail: { size: 8 } },
    design_24: { name: 'デザイン24 - スケール', color: '#708090', pattern: 'scales', patternDetail: { size: 6 } },
    design_25: { name: 'デザイン25 - 三角', color: '#FF7F50', pattern: 'triangles', patternDetail: { size: 8 } },
    design_26: { name: 'デザイン26 - ヘリンボーン', color: '#4B0082', pattern: 'herringbone', patternDetail: { size: 6 } },
    design_27: { name: 'デザイン27 - 組み市松', color: '#800000', pattern: 'checkerboard', patternDetail: { size: 4 } },
    design_28: { name: 'デザイン28 - 網目', color: '#808000', pattern: 'mesh', patternDetail: { size: 4 } },
    design_29: { name: 'デザイン29 - レーザー', color: '#CC0033', pattern: 'laser', patternDetail: { width: 1, spacing: 4 } },
    design_30: { name: 'デザイン30 - プラッド', color: '#556B7D', pattern: 'plaid', patternDetail: { size: 8 } }
};

// 現在のユニホーム設定
let uniformSettings = {
    color: 0xFF0000,
    sleeveColor: 0xFF0000,
    stripColor: 0xFFFFFF,
    number: 23,
    showNumber: true,
    pattern: 'solid',
    patternDetail: {},
    sleeveStyle: 'full',
    logoImage: null,
    logoScale: 1.0,
    logoOffsetX: 0,
    logoOffsetY: 0,
    logoLocked: false,
    logoPosition: 'front'
};

// 初期化
function init() {
    // シーン作成
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f7fa);
    
    // カメラ設定
    const canvas = document.getElementById('canvas');
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 3;
    
    // レンダラー設定
    renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        antialias: true, 
        alpha: true 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // ライティング
    setupLights();
    
    // ユニホーム作成
    createUniform();
    
    // マウスイベント
    setupMouseEvents();
    
    // ウィンドウリサイズ対応
    window.addEventListener('resize', onWindowResize);
    
    // UIイベント
    setupUIEvents();
    
    // アニメーション開始
    animate();
}

// ライティング設定
function setupLights() {
    // 環境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    // ディレクショナルライト
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // スポットライト
    const spotLight = new THREE.SpotLight(0xffffff, 0.5);
    spotLight.position.set(-5, 5, 5);
    scene.add(spotLight);
}

// パターンテクスチャ生成
function generatePatternTexture(pattern, detail, baseColor, patternColor, logoImage, logoScale, logoOffsetX, logoOffsetY, logoPosition) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    const rgb = {
        r: (baseColor >> 16) & 255,
        g: (baseColor >> 8) & 255,
        b: baseColor & 255
    };
    
    ctx.fillStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    ctx.fillRect(0, 0, 512, 512);
    
    const patternRGB = {
        r: (patternColor >> 16) & 255,
        g: (patternColor >> 8) & 255,
        b: patternColor & 255
    };
    const patternColorLight = `rgba(${patternRGB.r}, ${patternRGB.g}, ${patternRGB.b}, 0.7)`;
    const patternColorMedium = `rgba(${patternRGB.r}, ${patternRGB.g}, ${patternRGB.b}, 0.6)`;
    const patternColorFaint = `rgba(${patternRGB.r}, ${patternRGB.g}, ${patternRGB.b}, 0.5)`;
    const patternColorStrong = `rgba(${patternRGB.r}, ${patternRGB.g}, ${patternRGB.b}, 0.85)`;
    
    switch(pattern) {
        case 'solid':
            break;
        
        case 'vertical_stripes': {
            const width = detail.width || 2;
            const spacing = detail.spacing || 10;
            ctx.lineWidth = width * 1.5;
            for (let i = 0; i < 512; i += spacing) {
                ctx.strokeStyle = patternColorLight;
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, 512);
                ctx.stroke();
                for (let j = 1; j < width; j++) {
                    ctx.strokeStyle = `rgba(${patternRGB.r}, ${patternRGB.g}, ${patternRGB.b}, ${0.2 * (1 - j / width)})`;
                    ctx.beginPath();
                    ctx.moveTo(i + j, 0);
                    ctx.lineTo(i + j, 512);
                    ctx.stroke();
                }
            }
            break;
        }
        
        case 'horizontal_lines': {
            const width = detail.width || 2;
            const spacing = detail.spacing || 10;
            ctx.lineWidth = width * 1.5;
            ctx.strokeStyle = patternColorLight;
            for (let i = 0; i < 512; i += spacing) {
                ctx.beginPath();
                ctx.moveTo(0, i);
                ctx.lineTo(512, i);
                ctx.stroke();
            }
            break;
        }
        
        case 'checkerboard': {
            const size = detail.size || 16;
            ctx.fillStyle = patternColorMedium;
            for (let y = 0; y < 512; y += size) {
                for (let x = 0; x < 512; x += size) {
                    if ((Math.floor(x / size) + Math.floor(y / size)) % 2 === 0) {
                        ctx.fillRect(x, y, size, size);
                    }
                }
            }
            break;
        }
        
        case 'dots': {
            const size = detail.size || 6;
            const spacing = detail.spacing || 12;
            ctx.fillStyle = patternColorMedium;
            for (let y = 0; y < 512; y += spacing) {
                for (let x = 0; x < 512; x += spacing) {
                    ctx.beginPath();
                    ctx.arc(x + spacing / 2, y + spacing / 2, size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            break;
        }
        
        case 'zigzag': {
            const amplitude = detail.amplitude || 5;
            const frequency = detail.frequency || 4;
            ctx.strokeStyle = patternColorLight;
            ctx.lineWidth = 3;
            for (let x = 0; x < 512; x += 50) {
                ctx.beginPath();
                for (let y = 0; y < 512; y += 5) {
                    const px = x + Math.sin(y / 10 * frequency) * amplitude;
                    if (y === 0) ctx.moveTo(px, y);
                    else ctx.lineTo(px, y);
                }
                ctx.stroke();
            }
            break;
        }
        
        case 'diagonal_lines': {
            const spacing = detail.spacing || 10;
            const angle = detail.angle || 45;
            ctx.save();
            ctx.translate(256, 256);
            ctx.rotate(angle * Math.PI / 180);
            ctx.translate(-256, -256);
            ctx.strokeStyle = patternColorLight;
            for (let i = -512; i < 1024; i += spacing) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, 512);
                ctx.stroke();
            }
            ctx.restore();
            break;
        }
        
        case 'wave': {
            const amplitude = detail.amplitude || 4;
            const frequency = detail.frequency || 6;
            ctx.strokeStyle = patternColorLight;
            ctx.lineWidth = 3;
            for (let offset = 0; offset < 512; offset += 30) {
                ctx.beginPath();
                for (let x = 0; x < 512; x++) {
                    const y = offset + Math.sin(x / 50 * frequency) * amplitude;
                    if (x === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.stroke();
            }
            break;
        }
        
        case 'cross': {
            const spacing = detail.spacing || 16;
            ctx.strokeStyle = patternColorLight;
            ctx.lineWidth = 2;
            for (let i = 0; i < 512; i += spacing) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, 512);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(0, i);
                ctx.lineTo(512, i);
                ctx.stroke();
            }
            break;
        }
        
        case 'diamond': {
            const size = detail.size || 12;
            ctx.fillStyle = patternColorMedium;
            ctx.strokeStyle = patternColorLight;
            for (let y = 0; y < 512; y += size * 2) {
                for (let x = 0; x < 512; x += size * 2) {
                    ctx.beginPath();
                    ctx.moveTo(x + size, y);
                    ctx.lineTo(x + size * 2, y + size);
                    ctx.lineTo(x + size, y + size * 2);
                    ctx.lineTo(x, y + size);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                }
            }
            break;
        }
        
        case 'triangle_stripes': {
            const size = detail.size || 8;
            ctx.fillStyle = patternColorMedium;
            for (let y = 0; y < 512; y += size) {
                for (let x = 0; x < 512; x += size) {
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + size, y);
                    ctx.lineTo(x + size / 2, y + size);
                    ctx.closePath();
                    ctx.fill();
                }
            }
            break;
        }
        
        case 'scales': {
            const size = detail.size || 6;
            ctx.fillStyle = patternColorMedium;
            for (let y = 0; y < 512; y += size) {
                for (let x = 0; x < 512; x += size) {
                    ctx.beginPath();
                    ctx.arc(x + size / 2, y + size / 2, size / 1.5, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            break;
        }
        
        case 'mesh': {
            const size = detail.size || 4;
            ctx.strokeStyle = patternColorMedium;
            ctx.lineWidth = 1.5;
            for (let i = 0; i < 512; i += size) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, 512);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(0, i);
                ctx.lineTo(512, i);
                ctx.stroke();
            }
            break;
        }
        
        case 'laser': {
            const spacing = detail.spacing || 4;
            ctx.strokeStyle = patternColorStrong;
            ctx.lineWidth = detail.width || 1;
            for (let i = 0; i < 512; i += spacing) {
                ctx.beginPath();
                ctx.moveTo(0, i);
                ctx.lineTo(512, i);
                ctx.stroke();
            }
            break;
        }
        
        case 'plaid': {
            const size = detail.size || 8;
            ctx.strokeStyle = patternColorMedium;
            ctx.lineWidth = 2.5;
            for (let i = 0; i < 512; i += size * 2) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, 512);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(0, i);
                ctx.lineTo(512, i);
                ctx.stroke();
            }
            break;
        }
        
        case 'half_split': {
            ctx.fillStyle = `rgba(${patternRGB.r}, ${patternRGB.g}, ${patternRGB.b}, 0.35)`;
            ctx.fillRect(256, 0, 256, 512);
            break;
        }
        
        case 'teardrop': {
            const size = detail.size || 8;
            ctx.fillStyle = patternColorMedium;
            for (let y = 0; y < 512; y += size * 2) {
                for (let x = 0; x < 512; x += size * 2) {
                    ctx.beginPath();
                    ctx.moveTo(x + size / 2, y);
                    ctx.quadraticCurveTo(x + size, y + size / 2, x + size / 2, y + size);
                    ctx.quadraticCurveTo(x, y + size / 2, x + size / 2, y);
                    ctx.fill();
                }
            }
            break;
        }
        
        case 'herringbone': {
            const size = detail.size || 6;
            ctx.strokeStyle = patternColorMedium;
            for (let y = -512; y < 1024; y += size * 2) {
                for (let x = -512; x < 1024; x += size * 2) {
                    ctx.beginPath();
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + size, y + size);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(x + size, y);
                    ctx.lineTo(x, y + size);
                    ctx.stroke();
                }
            }
            break;
        }
        
        case 'honeycomb': {
            const size = detail.size || 10;
            ctx.strokeStyle = patternColorMedium;
            ctx.lineWidth = 1;
            for (let y = 0; y < 512; y += size * 1.5) {
                for (let x = 0; x < 512; x += size * 2) {
                    const offsetX = (y / (size * 1.5)) % 2 === 0 ? 0 : size;
                    const hexX = x + offsetX;
                    const hexY = y;
                    drawHexagon(ctx, hexX, hexY, size);
                }
            }
            break;
        }
        
        case 'triple_stripes': {
            const width = detail.width || 2;
            const spacing = detail.spacing || 6;
            for (let i = 0; i < 512; i += spacing * 3) {
                for (let j = 0; j < 3; j++) {
                    ctx.strokeStyle = `rgba(${patternRGB.r}, ${patternRGB.g}, ${patternRGB.b}, ${0.4 * (1 - j * 0.2)})`;
                    ctx.beginPath();
                    ctx.moveTo(i + j * width * 2, 0);
                    ctx.lineTo(i + j * width * 2, 512);
                    ctx.stroke();
                }
            }
            break;
        }
        
        case 'gradient': {
            const direction = detail.direction || 'vertical';
            const gradient = direction === 'vertical' 
                ? ctx.createLinearGradient(0, 0, 0, 512)
                : ctx.createLinearGradient(0, 0, 512, 0);
            gradient.addColorStop(0, `rgba(${patternRGB.r}, ${patternRGB.g}, ${patternRGB.b}, 0)`);
            gradient.addColorStop(0.5, patternColorMedium);
            gradient.addColorStop(1, `rgba(${patternRGB.r}, ${patternRGB.g}, ${patternRGB.b}, 0)`);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 512, 512);
            break;
        }
    }

    if (logoImage && logoPosition === 'front') {
        const logoSize = 180 * logoScale;
        const maxOffset = 150 * logoScale;
        const logoX = (512 - logoSize) / 2 + logoOffsetX * maxOffset;
        const logoY = (512 - logoSize) / 2 + logoOffsetY * maxOffset;
        ctx.save();
        ctx.globalAlpha = 0.95;
        ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
        ctx.restore();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
}

// 六角形を描画
function drawHexagon(ctx, x, y, size) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
        const angle = (i * 60) * Math.PI / 180;
        const px = x + size * Math.cos(angle);
        const py = y + size * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
}

// ユニホーム作成
function createUniform() {
    // 既存のメッシュを削除
    if (uniformMesh) {
        scene.remove(uniformMesh);
    }
    
    const group = new THREE.Group();
    
    // ボディ（胴体）
    const bodyGeometry = new THREE.BoxGeometry(1.2, 1.6, 0.3);
    const bodyTexture = generatePatternTexture(
        uniformSettings.pattern,
        uniformSettings.patternDetail,
        uniformSettings.color,
        uniformSettings.stripColor,
        uniformSettings.logoImage,
        uniformSettings.logoScale,
        uniformSettings.logoOffsetX,
        uniformSettings.logoOffsetY,
        uniformSettings.logoPosition
    );
    const bodyMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xFFFFFF,
        map: bodyTexture,
        roughness: 0.4,
        metalness: 0.1
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.z = 0;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);
    
    // 左袖
    const leftSleeveGeometry = createSleeveGeometry(uniformSettings.sleeveStyle);
    const sleeveMaterial = new THREE.MeshStandardMaterial({ 
        color: uniformSettings.sleeveColor,
        roughness: 0.4,
        metalness: 0.1
    });
    const leftSleeve = new THREE.Mesh(leftSleeveGeometry, sleeveMaterial);
    leftSleeve.position.set(-0.7, 0.4, 0);
    leftSleeve.rotation.z = Math.PI / 6;
    group.add(leftSleeve);
    
    // 右袖
    const rightSleeve = new THREE.Mesh(leftSleeveGeometry, sleeveMaterial);
    rightSleeve.position.set(0.7, 0.4, 0);
    rightSleeve.rotation.z = -Math.PI / 6;
    group.add(rightSleeve);
    
    // 背番号テキスト
    if (uniformSettings.showNumber) {
        addNumber(group);
    }
    
    // 首部分
    const neckGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.2, 32);
    const neckMaterial = new THREE.MeshStandardMaterial({ 
        color: uniformSettings.color,
        roughness: 0.4
    });
    const neck = new THREE.Mesh(neckGeometry, neckMaterial);
    neck.position.y = 0.85;
    neck.scale.z = 0.5;
    group.add(neck);
    
    uniformMesh = group;
    scene.add(uniformMesh);
}

// 袖のジオメトリ作成
function createSleeveGeometry(style) {
    switch(style) {
        case 'half':
            return new THREE.BoxGeometry(0.5, 0.6, 0.25);
        case 'none':
            return new THREE.BoxGeometry(0.2, 0.2, 0.15);
        case 'full':
        default:
            return new THREE.BoxGeometry(0.5, 1.2, 0.25);
    }
}

// 背番号を追加
function addNumber(group) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    
    const numberColorCSS = `#${uniformSettings.stripColor.toString(16).padStart(6, '0')}`;
    
    // テキスト（背景なし）
    ctx.fillStyle = numberColorCSS;
    ctx.font = 'bold 120px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(uniformSettings.number, 128, 128);
    
    const texture = new THREE.CanvasTexture(canvas);
    const numberGeometry = new THREE.PlaneGeometry(0.6, 0.6);
    const numberMaterial = new THREE.MeshStandardMaterial({ 
        map: texture,
        transparent: true,
        emissive: 0x222222
    });
    const numberMesh = new THREE.Mesh(numberGeometry, numberMaterial);
    numberMesh.position.y = -0.2;
    numberMesh.position.z = 0.16;
    group.add(numberMesh);
}

// マウス／タッチイベント設定
function setupMouseEvents() {
    const canvas = document.getElementById('canvas');
    canvas.style.touchAction = 'none';
    let isPinching = false;
    let initialPinchDistance = 0;
    let initialCameraZ = camera.position.z;
    let isLogoManipulating = false;

    const getTouchPosition = (touch) => ({ x: touch.clientX, y: touch.clientY });
    const getDistance = (touch1, touch2) => {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    };

    canvas.addEventListener('mousedown', (e) => {
        // Shift+クリックでロゴ操作モード
        if (e.shiftKey && uniformSettings.logoImage) {
            isLogoManipulating = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        } else {
            isDragging = true;
            autoRotate = false;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        }
    });

    canvas.addEventListener('mousemove', (e) => {
        if (isLogoManipulating) {
            // Shift+ドラッグでロゴ操作
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;
            
            // Ctrlキーで拡大縮小、通常でロゴ移動
            if (e.ctrlKey) {
                // スケール調整
                const scaleDelta = deltaY * 0.01;
                uniformSettings.logoScale = Math.max(0.3, Math.min(2, uniformSettings.logoScale + scaleDelta));
            } else {
                // 位置調整
                const maxOffset = 0.5 * uniformSettings.logoScale;
                uniformSettings.logoOffsetX = Math.max(-maxOffset, Math.min(maxOffset, uniformSettings.logoOffsetX + deltaX * 0.002));
                uniformSettings.logoOffsetY = Math.max(-maxOffset, Math.min(maxOffset, uniformSettings.logoOffsetY - deltaY * 0.002));
            }
            
            previousMousePosition = { x: e.clientX, y: e.clientY };
            createUniform();
        } else if (isDragging) {
            // 通常ドラッグでユニホーム回転
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;
            uniformRotation.y += deltaX * 0.01;
            uniformRotation.x += deltaY * 0.01;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        }
    });

    canvas.addEventListener('mouseup', () => {
        isDragging = false;
        isLogoManipulating = false;
    });

    canvas.addEventListener('mouseleave', () => {
        isDragging = false;
        isLogoManipulating = false;
    });

    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        autoRotate = false;
        if (e.touches.length === 1) {
            isDragging = true;
            const touchPos = getTouchPosition(e.touches[0]);
            previousMousePosition = touchPos;
        } else if (e.touches.length === 2) {
            isDragging = false;
            isPinching = true;
            initialPinchDistance = getDistance(e.touches[0], e.touches[1]);
            initialCameraZ = camera.position.z;
        }
    }, { passive: false });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (isPinching && e.touches.length === 2) {
            const currentDistance = getDistance(e.touches[0], e.touches[1]);
            const zoomDelta = (initialPinchDistance - currentDistance) * 0.01;
            camera.position.z = initialCameraZ + zoomDelta;
            camera.position.z = Math.max(1.5, Math.min(8, camera.position.z));
        } else if (isDragging && e.touches.length === 1) {
            const touchPos = getTouchPosition(e.touches[0]);
            const deltaX = touchPos.x - previousMousePosition.x;
            const deltaY = touchPos.y - previousMousePosition.y;
            uniformRotation.y += deltaX * 0.01;
            uniformRotation.x += deltaY * 0.01;
            previousMousePosition = touchPos;
        }
    }, { passive: false });

    canvas.addEventListener('touchend', (e) => {
        if (e.touches.length === 0) {
            isDragging = false;
            isPinching = false;
        } else if (e.touches.length === 1) {
            isPinching = false;
            isDragging = true;
            previousMousePosition = getTouchPosition(e.touches[0]);
        }
    });

    canvas.addEventListener('touchcancel', () => {
        isDragging = false;
        isPinching = false;
    });

    // ホイールズーム
    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomSpeed = 0.1;
        if (e.deltaY > 0) {
            camera.position.z += zoomSpeed;
        } else {
            camera.position.z -= zoomSpeed;
        }
        camera.position.z = Math.max(1.5, Math.min(8, camera.position.z));
    });
}

// UIイベント設定
function setupUIEvents() {
    // デザイン選択
    document.getElementById('designPreset').addEventListener('change', (e) => {
        const designKey = e.target.value;
        if (designTemplates[designKey]) {
            const design = designTemplates[designKey];
            const designStripColor = design.stripColor || '#FFFFFF';
            const designSleeveColor = design.sleeveColor || design.color;
            uniformSettings.color = parseInt(design.color.slice(1), 16);
            uniformSettings.sleeveColor = parseInt(designSleeveColor.slice(1), 16);
            uniformSettings.stripColor = parseInt(designStripColor.slice(1), 16);
            uniformSettings.pattern = design.pattern || 'solid';
            uniformSettings.patternDetail = design.patternDetail || {};
            uniformSettings.logoImage = null;
            uniformSettings.sleeveStyle = design.sleeveStyle || 'full';
            
            // UIを更新
            document.getElementById('colorPicker').value = design.color;
            document.getElementById('colorValue').textContent = design.color.toUpperCase();
            document.getElementById('sleeveColorPicker').value = designSleeveColor;
            document.getElementById('sleeveColorValue').textContent = designSleeveColor.toUpperCase();
            document.getElementById('stripColorPicker').value = designStripColor;
            document.getElementById('stripColorValue').textContent = designStripColor.toUpperCase();
            document.getElementById('patternSelect').value = design.pattern || 'solid';
            document.getElementById('logoUpload').value = '';
            document.getElementById('sleeveStyle').value = design.sleeveStyle || 'full';
            
            createUniform();
        }
    });
    
    // ユニホームカラー
    document.getElementById('colorPicker').addEventListener('change', (e) => {
        uniformSettings.color = parseInt(e.target.value.slice(1), 16);
        document.getElementById('colorValue').textContent = e.target.value.toUpperCase();
        document.getElementById('designPreset').value = 'custom';  // カスタムに切り替え
        createUniform();
    });

    // パターン
    document.getElementById('patternSelect').addEventListener('change', (e) => {
        uniformSettings.pattern = e.target.value;
        uniformSettings.patternDetail = {};
        document.getElementById('designPreset').value = 'custom';
        createUniform();
    });

    // ロゴアップロード
    document.getElementById('logoUpload').addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) {
            uniformSettings.logoImage = null;
            createUniform();
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            const image = new Image();
            image.onload = () => {
                uniformSettings.logoImage = image;
                document.getElementById('designPreset').value = 'custom';
                createUniform();
            };
            image.src = reader.result;
        };
        reader.readAsDataURL(file);
    });

    document.getElementById('clearLogoButton').addEventListener('click', () => {
        uniformSettings.logoImage = null;
        document.getElementById('logoUpload').value = '';
        document.getElementById('designPreset').value = 'custom';
        createUniform();
    });

    const logoScaleInput = document.getElementById('logoScale');
    const logoOffsetXInput = document.getElementById('logoOffsetX');
    const logoOffsetYInput = document.getElementById('logoOffsetY');
    const logoLockInput = document.getElementById('logoLock');
    const logoScaleValue = document.getElementById('logoScaleValue');
    const logoOffsetXValue = document.getElementById('logoOffsetXValue');
    const logoOffsetYValue = document.getElementById('logoOffsetYValue');

    const updateLogoPreviewValues = () => {
        logoScaleValue.textContent = `${Math.round(uniformSettings.logoScale * 100)}%`;
        logoOffsetXValue.textContent = uniformSettings.logoOffsetX.toFixed(2);
        logoOffsetYValue.textContent = uniformSettings.logoOffsetY.toFixed(2);
    };

    const toggleLogoControls = (locked) => {
        logoScaleInput.disabled = locked;
        logoOffsetXInput.disabled = locked;
        logoOffsetYInput.disabled = locked;
    };

    document.getElementById('logoScale').addEventListener('input', (e) => {
        if (uniformSettings.logoLocked) return;
        uniformSettings.logoScale = parseFloat(e.target.value);
        
        // スケールに応じてx/y軸の範囲を調整
        const maxOffset = 0.5 * uniformSettings.logoScale;
        logoOffsetXInput.max = maxOffset.toFixed(2);
        logoOffsetXInput.min = (-maxOffset).toFixed(2);
        logoOffsetYInput.max = maxOffset.toFixed(2);
        logoOffsetYInput.min = (-maxOffset).toFixed(2);
        
        document.getElementById('designPreset').value = 'custom';
        updateLogoPreviewValues();
        createUniform();
    });

    document.getElementById('logoOffsetX').addEventListener('input', (e) => {
        if (uniformSettings.logoLocked) return;
        const newValue = parseFloat(e.target.value);
        const maxOffset = 0.5 * uniformSettings.logoScale;
        uniformSettings.logoOffsetX = Math.max(-maxOffset, Math.min(maxOffset, newValue));
        e.target.value = uniformSettings.logoOffsetX;
        document.getElementById('designPreset').value = 'custom';
        updateLogoPreviewValues();
        createUniform();
    });

    document.getElementById('logoOffsetY').addEventListener('input', (e) => {
        if (uniformSettings.logoLocked) return;
        const newValue = parseFloat(e.target.value);
        const maxOffset = 0.5 * uniformSettings.logoScale;
        uniformSettings.logoOffsetY = Math.max(-maxOffset, Math.min(maxOffset, newValue));
        e.target.value = uniformSettings.logoOffsetY;
        document.getElementById('designPreset').value = 'custom';
        updateLogoPreviewValues();
        createUniform();
    });

    document.getElementById('logoLock').addEventListener('change', (e) => {
        uniformSettings.logoLocked = e.target.checked;
        toggleLogoControls(uniformSettings.logoLocked);
    });

    // ロゴ配置位置
    if (document.getElementById('logoPosition')) {
        document.getElementById('logoPosition').addEventListener('change', (e) => {
            uniformSettings.logoPosition = e.target.value;
            document.getElementById('designPreset').value = 'custom';
            createUniform();
        });
    }

    updateLogoPreviewValues();
    toggleLogoControls(uniformSettings.logoLocked);

    // 袖カラー
    document.getElementById('sleeveColorPicker').addEventListener('change', (e) => {
        uniformSettings.sleeveColor = parseInt(e.target.value.slice(1), 16);
        document.getElementById('sleeveColorValue').textContent = e.target.value.toUpperCase();
        document.getElementById('designPreset').value = 'custom';  // カスタムに切り替え
        createUniform();
    });
    
    // 背番号
    document.getElementById('numberInput').addEventListener('change', (e) => {
        const value = parseInt(e.target.value, 10);
        uniformSettings.number = Number.isNaN(value) ? 0 : value;
        createUniform();
    });
    
    document.getElementById('numberToggle').addEventListener('change', (e) => {
        uniformSettings.showNumber = e.target.checked;
        createUniform();
    });
    
    // ストライプカラー
    document.getElementById('stripColorPicker').addEventListener('change', (e) => {
        uniformSettings.stripColor = parseInt(e.target.value.slice(1), 16);
        document.getElementById('stripColorValue').textContent = e.target.value.toUpperCase();
        document.getElementById('designPreset').value = 'custom';  // カスタムに切り替え
        createUniform();
    });
    
    // 袖スタイル
    document.getElementById('sleeveStyle').addEventListener('change', (e) => {
        uniformSettings.sleeveStyle = e.target.value;
        document.getElementById('designPreset').value = 'custom';  // カスタムに切り替え
        createUniform();
    });
    
    // 自動回転
    document.getElementById('rotationSpeed').addEventListener('change', (e) => {
        autoRotate = e.target.checked;
    });
    
    // リセット
    document.getElementById('resetButton').addEventListener('click', resetUniform);
}

// ユニホームをリセット
function resetUniform() {
    uniformSettings = {
        color: 0xFF0000,
        sleeveColor: 0xFF0000,
        stripColor: 0xFFFFFF,
        number: 23,
        showNumber: true,
        pattern: 'solid',
        patternDetail: {},
        sleeveStyle: 'full',
        logoImage: null,
        logoScale: 1.0,
        logoOffsetX: 0,
        logoOffsetY: 0,
        logoLocked: false,
        logoPosition: 'front'
    };
    
    uniformRotation = { x: 0, y: 0 };
    autoRotate = true;
    
    document.getElementById('designPreset').value = 'design_1';
    document.getElementById('colorPicker').value = '#FF0000';
    document.getElementById('colorValue').textContent = '#FF0000';
    document.getElementById('patternSelect').value = 'solid';
    document.getElementById('logoUpload').value = '';
    document.getElementById('logoScale').value = 1;
    document.getElementById('logoScaleValue').textContent = '100%';
    document.getElementById('logoOffsetX').value = 0;
    document.getElementById('logoOffsetXValue').textContent = '0.00';
    document.getElementById('logoOffsetY').value = 0;
    document.getElementById('logoOffsetYValue').textContent = '0.00';
    document.getElementById('logoLock').checked = false;
    document.getElementById('numberInput').value = 23;
    document.getElementById('numberToggle').checked = true;
    document.getElementById('stripColorPicker').value = '#FFFFFF';
    document.getElementById('stripColorValue').textContent = '#FFFFFF';
    document.getElementById('sleeveColorPicker').value = '#FF0000';
    document.getElementById('sleeveColorValue').textContent = '#FF0000';
    document.getElementById('sleeveStyle').value = 'full';
    document.getElementById('rotationSpeed').checked = true;
    
    createUniform();
}

// ウィンドウリサイズ対応
function onWindowResize() {
    const canvas = document.getElementById('canvas');
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

// アニメーションループ
function animate() {
    requestAnimationFrame(animate);
    
    if (uniformMesh) {
        uniformMesh.rotation.x = uniformRotation.x;
        uniformMesh.rotation.y = uniformRotation.y;
        
        // 自動回転
        if (autoRotate && !isDragging) {
            uniformRotation.y += 0.005;
        }
    }
    
    renderer.render(scene, camera);
}

// ページ読み込み時に初期化
window.addEventListener('load', init);
