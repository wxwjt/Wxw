/**
 * 工具总和 - 通用工具函数库
 * 包含各种实用工具和辅助函数
 */

// 全局工具对象
const Tools = {
    // 代码格式化工具
    codeFormatter: {
        /**
         * 格式化JSON代码
         * @param {string} code - 要格式化的JSON代码
         * @returns {string} - 格式化后的JSON代码
         */
        formatJSON(code) {
            try {
                const parsed = JSON.parse(code);
                return JSON.stringify(parsed, null, 2);
            } catch (error) {
                throw new Error('无效的JSON格式');
            }
        },
        
        /**
         * 格式化HTML代码
         * @param {string} code - 要格式化的HTML代码
         * @returns {string} - 格式化后的HTML代码
         */
        formatHTML(code) {
            // 简单的HTML格式化实现
            let formatted = code;
            let indent = 0;
            const indentSize = 2;
            
            // 替换自闭合标签
            formatted = formatted.replace(/(<\/?\w+)([^>]*)\/>/g, '$1$2>');
            
            // 格式化开始标签
            formatted = formatted.replace(/<(\w+)([^>]*)>/g, (match, tag, attrs) => {
                const spaces = ' '.repeat(indent);
                indent += indentSize;
                return `\n${spaces}<${tag}${attrs}>`;
            });
            
            // 格式化结束标签
            formatted = formatted.replace(/<\/(\w+)>/g, (match, tag) => {
                indent = Math.max(0, indent - indentSize);
                const spaces = ' '.repeat(indent);
                return `\n${spaces}</${tag}>`;
            });
            
            // 清理多余的空行
            formatted = formatted.replace(/\n\s*\n/g, '\n');
            
            return formatted.trim();
        },
        
        /**
         * 格式化JavaScript代码
         * @param {string} code - 要格式化的JavaScript代码
         * @returns {string} - 格式化后的JavaScript代码
         */
        formatJavaScript(code) {
            let formatted = code;
            let indent = 0;
            const indentSize = 2;
            let inString = false;
            let stringChar = '';
            
            for (let i = 0; i < formatted.length; i++) {
                const char = formatted[i];
                const nextChar = formatted[i + 1] || '';
                
                // 处理字符串
                if ((char === '"' || char === "'" || char === '`') && (i === 0 || formatted[i - 1] !== '\\')) {
                    if (inString && char === stringChar) {
                        inString = false;
                        stringChar = '';
                    } else if (!inString) {
                        inString = true;
                        stringChar = char;
                    }
                }
                
                // 不在字符串中时处理缩进
                if (!inString) {
                    if (char === '{' || char === '[') {
                        indent += indentSize;
                        formatted = formatted.slice(0, i + 1) + '\n' + ' '.repeat(indent) + formatted.slice(i + 1);
                        i += indentSize + 1;
                    } else if (char === '}' || char === ']') {
                        indent = Math.max(0, indent - indentSize);
                        formatted = formatted.slice(0, i) + '\n' + ' '.repeat(indent) + formatted.slice(i);
                        i += indentSize + 1;
                    } else if (char === ';' && nextChar !== '\n') {
                        formatted = formatted.slice(0, i + 1) + '\n' + ' '.repeat(indent) + formatted.slice(i + 1);
                        i += indentSize + 1;
                    }
                }
            }
            
            // 清理多余的空行
            formatted = formatted.replace(/\n\s*\n/g, '\n');
            
            return formatted.trim();
        },
        
        /**
         * 格式化CSS代码
         * @param {string} code - 要格式化的CSS代码
         * @returns {string} - 格式化后的CSS代码
         */
        formatCSS(code) {
            let formatted = code;
            let indent = 0;
            const indentSize = 2;
            
            // 格式化选择器
            formatted = formatted.replace(/([^{]+)\{/g, (match, selector) => {
                return selector.trim() + ' {\n';
            });
            
            // 格式化属性
            formatted = formatted.replace(/([^:;]+):([^;]+);/g, (match, prop, value) => {
                return '  ' + prop.trim() + ': ' + value.trim() + ';\n';
            });
            
            // 格式化结束括号
            formatted = formatted.replace(/\}/g, '}\n\n');
            
            // 清理多余的空行
            formatted = formatted.replace(/\n\s*\n/g, '\n');
            
            return formatted.trim();
        },
        
        /**
         * 压缩代码
         * @param {string} code - 要压缩的代码
         * @param {string} language - 代码语言
         * @returns {string} - 压缩后的代码
         */
        minifyCode(code, language) {
            let minified = code;
            
            // 移除注释
            minified = minified.replace(/\/\*[\s\S]*?\*\//g, ''); // 多行注释
            minified = minified.replace(/\/\/.*$/gm, ''); // 单行注释
            
            // 移除多余的空白字符
            minified = minified.replace(/\s+/g, ' ');
            
            // 根据语言进行特定的压缩
            switch (language) {
                case 'json':
                    try {
                        const parsed = JSON.parse(minified);
                        return JSON.stringify(parsed);
                    } catch (error) {
                        throw new Error('无效的JSON格式');
                    }
                case 'html':
                    minified = minified.replace(/>\s+</g, '><');
                    break;
                case 'css':
                    minified = minified.replace(/;\s*}/g, '}');
                    minified = minified.replace(/:\s+/g, ':');
                    minified = minified.replace(/,\s+/g, ',');
                    break;
                case 'javascript':
                    minified = minified.replace(/;\s*}/g, '}');
                    minified = minified.replace(/:\s+/g, ':');
                    minified = minified.replace(/,\s+/g, ',');
                    minified = minified.replace(/\s*\(\s*/g, '(');
                    minified = minified.replace(/\s*\)\s*/g, ')');
                    minified = minified.replace(/\s*{\s*/g, '{');
                    minified = minified.replace(/\s*}\s*/g, '}');
                    break;
            }
            
            return minified.trim();
        }
    },
    
    // 像素艺术生成器
    pixelArt: {
        /**
         * 创建像素画布
         * @param {number} width - 宽度（像素）
         * @param {number} height - 高度（像素）
         * @param {number} pixelSize - 像素大小
         * @returns {Object} - 画布对象
         */
        createCanvas(width, height, pixelSize) {
            const pixels = [];
            
            // 初始化像素数组
            for (let y = 0; y < height; y++) {
                pixels[y] = [];
                for (let x = 0; x < width; x++) {
                    pixels[y][x] = '#FFFFFF'; // 初始为白色
                }
            }
            
            return {
                width,
                height,
                pixelSize,
                pixels,
                currentColor: '#000000'
            };
        },
        
        /**
         * 设置像素颜色
         * @param {Object} canvas - 画布对象
         * @param {number} x - X坐标
         * @param {number} y - Y坐标
         * @param {string} color - 颜色（HEX）
         */
        setPixel(canvas, x, y, color) {
            if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
                canvas.pixels[y][x] = color;
            }
        },
        
        /**
         * 填充区域
         * @param {Object} canvas - 画布对象
         * @param {number} x - X坐标
         * @param {number} y - Y坐标
         * @param {string} color - 颜色（HEX）
         */
        fillArea(canvas, x, y, color) {
            if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) return;
            
            const targetColor = canvas.pixels[y][x];
            if (targetColor === color) return;
            
            const queue = [{ x, y }];
            const visited = new Set();
            
            while (queue.length > 0) {
                const pixel = queue.shift();
                const key = `${pixel.x},${pixel.y}`;
                
                if (visited.has(key)) continue;
                visited.add(key);
                
                if (
                    pixel.x >= 0 &&
                    pixel.x < canvas.width &&
                    pixel.y >= 0 &&
                    pixel.y < canvas.height &&
                    canvas.pixels[pixel.y][pixel.x] === targetColor
                ) {
                    canvas.pixels[pixel.y][pixel.x] = color;
                    
                    queue.push({ x: pixel.x + 1, y: pixel.y });
                    queue.push({ x: pixel.x - 1, y: pixel.y });
                    queue.push({ x: pixel.x, y: pixel.y + 1 });
                    queue.push({ x: pixel.x, y: pixel.y - 1 });
                }
            }
        },
        
        /**
         * 导出为图片
         * @param {Object} canvas - 画布对象
         * @returns {string} - 图片数据URL
         */
        exportToImage(canvas) {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width * canvas.pixelSize;
            tempCanvas.height = canvas.height * canvas.pixelSize;
            const ctx = tempCanvas.getContext('2d');
            
            // 绘制像素
            for (let y = 0; y < canvas.height; y++) {
                for (let x = 0; x < canvas.width; x++) {
                    ctx.fillStyle = canvas.pixels[y][x];
                    ctx.fillRect(
                        x * canvas.pixelSize,
                        y * canvas.pixelSize,
                        canvas.pixelSize,
                        canvas.pixelSize
                    );
                }
            }
            
            return tempCanvas.toDataURL('image/png');
        }
    },
    
    // 科学计算器
    calculator: {
        /**
         * 基本计算
         * @param {number} num1 - 第一个数字
         * @param {number} num2 - 第二个数字
         * @param {string} operator - 运算符
         * @returns {number} - 计算结果
         */
        calculate(num1, num2, operator) {
            switch (operator) {
                case '+':
                    return num1 + num2;
                case '-':
                    return num1 - num2;
                case '*':
                    return num1 * num2;
                case '/':
                    if (num2 === 0) throw new Error('除数不能为零');
                    return num1 / num2;
                case '^':
                    return Math.pow(num1, num2);
                default:
                    throw new Error('未知运算符');
            }
        },
        
        /**
         * 科学函数计算
         * @param {string} func - 函数名
         * @param {number} num - 数字
         * @returns {number} - 计算结果
         */
        scientific(func, num) {
            switch (func) {
                case 'sin':
                    return Math.sin(num * Math.PI / 180);
                case 'cos':
                    return Math.cos(num * Math.PI / 180);
                case 'tan':
                    return Math.tan(num * Math.PI / 180);
                case 'asin':
                    return Math.asin(num) * 180 / Math.PI;
                case 'acos':
                    return Math.acos(num) * 180 / Math.PI;
                case 'atan':
                    return Math.atan(num) * 180 / Math.PI;
                case 'log':
                    return Math.log10(num);
                case 'ln':
                    return Math.log(num);
                case 'sqrt':
                    return Math.sqrt(num);
                case 'pow2':
                    return Math.pow(num, 2);
                case 'pow3':
                    return Math.pow(num, 3);
                case 'exp':
                    return Math.exp(num);
                case 'factorial':
                    return this.factorial(Math.floor(num));
                case 'abs':
                    return Math.abs(num);
                case 'ceil':
                    return Math.ceil(num);
                case 'floor':
                    return Math.floor(num);
                case 'round':
                    return Math.round(num);
                default:
                    throw new Error('未知函数');
            }
        },
        
        /**
         * 阶乘计算
         * @param {number} n - 数字
         * @returns {number} - 阶乘结果
         */
        factorial(n) {
            if (n < 0) throw new Error('阶乘不能用于负数');
            if (n === 0 || n === 1) return 1;
            
            let result = 1;
            for (let i = 2; i <= n; i++) {
                result *= i;
            }
            
            return result;
        }
    },
    
    // 二维码生成器
    qrCode: {
        /**
         * 生成二维码数据（简化版）
         * @param {string} text - 要编码的文本
         * @param {number} size - 二维码大小
         * @returns {Array} - 二维码矩阵数据
         */
        generateQRCode(text, size) {
            // 这里使用简化的QR码生成算法
            // 实际项目中建议使用专业的QR码库
            const matrixSize = Math.min(33, Math.max(21, Math.ceil(size / 10)));
            const matrix = [];
            
            // 初始化矩阵
            for (let y = 0; y < matrixSize; y++) {
                matrix[y] = [];
                for (let x = 0; x < matrixSize; x++) {
                    matrix[y][x] = 0;
                }
            }
            
            // 添加定位图案
            this.addPositionPatterns(matrix, matrixSize);
            
            // 添加数据（简化处理）
            let dataIndex = 0;
            for (let y = 0; y < matrixSize; y++) {
                for (let x = 0; x < matrixSize; x++) {
                    if (matrix[y][x] === 0) { // 只在空白位置添加数据
                        matrix[y][x] = this.getBitFromText(text, dataIndex++);
                    }
                }
            }
            
            return matrix;
        },
        
        /**
         * 添加定位图案
         * @param {Array} matrix - 二维码矩阵
         * @param {number} size - 矩阵大小
         */
        addPositionPatterns(matrix, size) {
            // 左上角定位图案
            this.drawPositionPattern(matrix, 3, 3);
            
            // 右上角定位图案
            this.drawPositionPattern(matrix, size - 4, 3);
            
            // 左下角定位图案
            this.drawPositionPattern(matrix, 3, size - 4);
        },
        
        /**
         * 绘制定位图案
         * @param {Array} matrix - 二维码矩阵
         * @param {number} x - X坐标
         * @param {number} y - Y坐标
         */
        drawPositionPattern(matrix, x, y) {
            for (let dy = -3; dy <= 3; dy++) {
                for (let dx = -3; dx <= 3; dx++) {
                    if (
                        y + dy >= 0 && y + dy < matrix.length &&
                        x + dx >= 0 && x + dx < matrix[0].length
                    ) {
                        const dist = Math.max(Math.abs(dx), Math.abs(dy));
                        matrix[y + dy][x + dx] = dist === 3 || dist === 0 ? 1 : 0;
                    }
                }
            }
        },
        
        /**
         * 从文本中获取位数据
         * @param {string} text - 文本
         * @param {number} index - 索引
         * @returns {number} - 位值（0或1）
         */
        getBitFromText(text, index) {
            const charIndex = index % text.length;
            const bitIndex = index % 8;
            const charCode = text.charCodeAt(charIndex);
            return (charCode >> bitIndex) & 1;
        },
        
        /**
         * 绘制二维码
         * @param {Array} matrix - 二维码矩阵
         * @param {HTMLCanvasElement} canvas - Canvas元素
         * @param {string} color - 前景色
         * @param {string} bgColor - 背景色
         */
        drawQRCode(matrix, canvas, color, bgColor) {
            const size = Math.min(canvas.width, canvas.height);
            const cellSize = size / matrix.length;
            const ctx = canvas.getContext('2d');
            
            // 清空画布
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, size, size);
            
            // 绘制二维码
            ctx.fillStyle = color;
            for (let y = 0; y < matrix.length; y++) {
                for (let x = 0; x < matrix[y].length; x++) {
                    if (matrix[y][x] === 1) {
                        ctx.fillRect(
                            x * cellSize,
                            y * cellSize,
                            cellSize,
                            cellSize
                        );
                    }
                }
            }
        }
    },
    
    // 颜色工具
    colorTool: {
        /**
         * HEX转RGB
         * @param {string} hex - HEX颜色值
         * @returns {Object|null} - RGB颜色对象
         */
        hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },
        
        /**
         * RGB转HEX
         * @param {number} r - 红色值
         * @param {number} g - 绿色值
         * @param {number} b - 蓝色值
         * @returns {string} - HEX颜色值
         */
        rgbToHex(r, g, b) {
            return '#' + [r, g, b].map(x => {
                const hex = x.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }).join('');
        },
        
        /**
         * RGB转HSL
         * @param {number} r - 红色值
         * @param {number} g - 绿色值
         * @param {number} b - 蓝色值
         * @returns {Object} - HSL颜色对象
         */
        rgbToHsl(r, g, b) {
            r /= 255;
            g /= 255;
            b /= 255;
            
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;
            
            if (max === min) {
                h = s = 0; // 灰色
            } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                
                h /= 6;
            }
            
            return {
                h: h * 360,
                s: s * 100,
                l: l * 100
            };
        },
        
        /**
         * HSL转RGB
         * @param {number} h - 色相值
         * @param {number} s - 饱和度值
         * @param {number} l - 亮度值
         * @returns {Object} - RGB颜色对象
         */
        hslToRgb(h, s, l) {
            h /= 360;
            s /= 100;
            l /= 100;
            
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            
            let r, g, b;
            
            if (s === 0) {
                r = g = b = l; // 灰色
            } else {
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                
                r = hue2rgb(p, q, h + 1/3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1/3);
            }
            
            return {
                r: Math.round(r * 255),
                g: Math.round(g * 255),
                b: Math.round(b * 255)
            };
        },
        
        /**
         * 生成随机颜色
         * @returns {string} - HEX颜色值
         */
        generateRandomColor() {
            return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        },
        
        /**
         * 生成调色板
         * @param {string} baseColor - 基础颜色
         * @param {string} type - 调色板类型
         * @returns {Array} - 颜色数组
         */
        generateColorPalette(baseColor, type) {
            const rgb = this.hexToRgb(baseColor);
            if (!rgb) return [];
            
            const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
            const palette = [];
            
            switch (type) {
                case 'monochromatic':
                    // 单色调色板
                    for (let i = 0; i < 5; i++) {
                        const lightness = Math.max(10, Math.min(90, hsl.l + (i - 2) * 20));
                        const newRgb = this.hslToRgb(hsl.h, hsl.s, lightness);
                        palette.push(this.rgbToHex(newRgb.r, newRgb.g, newRgb.b));
                    }
                    break;
                    
                case 'analogous':
                    // 类似色调色板
                    for (let i = -2; i <= 2; i++) {
                        const hue = (hsl.h + i * 30 + 360) % 360;
                        const newRgb = this.hslToRgb(hue, hsl.s, hsl.l);
                        palette.push(this.rgbToHex(newRgb.r, newRgb.g, newRgb.b));
                    }
                    break;
                    
                case 'complementary':
                    // 互补色调色板
                    const complementHue = (hsl.h + 180) % 360;
                    palette.push(baseColor);
                    palette.push(this.rgbToHex(...Object.values(this.hslToRgb(complementHue, hsl.s, hsl.l))));
                    break;
                    
                default:
                    palette.push(baseColor);
            }
            
            return palette;
        }
    },
    
    // 密码生成器
    passwordGenerator: {
        /**
         * 生成密码
         * @param {Object} options - 选项
         * @returns {string} - 生成的密码
         */
        generatePassword(options = {}) {
            const {
                length = 12,
                useUppercase = true,
                useLowercase = true,
                useNumbers = true,
                useSymbols = true,
                excludeSimilar = false
            } = options;
            
            let chars = '';
            const similarChars = 'il1Lo0O';
            
            if (useLowercase) {
                chars += excludeSimilar ? 'abcdefghjkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
            }
            
            if (useUppercase) {
                chars += excludeSimilar ? 'ABCDEFGHJKMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            }
            
            if (useNumbers) {
                chars += excludeSimilar ? '23456789' : '0123456789';
            }
            
            if (useSymbols) {
                chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
            }
            
            if (chars.length === 0) {
                throw new Error('至少需要选择一种字符类型');
            }
            
            let password = '';
            for (let i = 0; i < length; i++) {
                password += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            
            return password;
        },
        
        /**
         * 评估密码强度
         * @param {string} password - 要评估的密码
         * @returns {Object} - 强度评估结果
         */
        evaluateStrength(password) {
            let score = 0;
            const feedback = [];
            
            // 长度评分
            if (password.length >= 8) score += 25;
            else feedback.push('密码长度应至少为8个字符');
            
            if (password.length >= 12) score += 25;
            else feedback.push('密码长度最好为12个字符或更长');
            
            // 复杂度评分
            if (/[a-z]/.test(password)) score += 10;
            else feedback.push('应包含小写字母');
            
            if (/[A-Z]/.test(password)) score += 10;
            else feedback.push('应包含大写字母');
            
            if (/[0-9]/.test(password)) score += 10;
            else feedback.push('应包含数字');
            
            if (/[^a-zA-Z0-9]/.test(password)) score += 10;
            else feedback.push('应包含特殊字符');
            
            // 唯一性评分
            const uniqueChars = new Set(password).size;
            const uniqueness = uniqueChars / password.length;
            
            if (uniqueness >= 0.7) score += 10;
            else feedback.push('避免使用重复字符');
            
            // 确定强度级别
            let strength = 'weak';
            if (score >= 80) strength = 'strong';
            else if (score >= 60) strength = 'good';
            else if (score >= 40) strength = 'fair';
            
            return {
                score,
                strength,
                feedback
            };
        }
    },
    
    // 单位转换器
    unitConverter: {
        // 转换系数
        conversionRates: {
            length: {
                mm: 1,
                cm: 10,
                m: 1000,
                km: 1000000,
                in: 25.4,
                ft: 304.8,
                yd: 914.4,
                mi: 1609344,
                nmi: 1852000
            },
            weight: {
                mg: 1,
                g: 1000,
                kg: 1000000,
                t: 1000000000,
                oz: 28349.5,
                lb: 453592,
                st: 6350293
            },
            temperature: {}, // 温度需要特殊处理
            area: {
                mm2: 1,
                cm2: 100,
                m2: 1000000,
                km2: 1000000000000,
                in2: 645.16,
                ft2: 92903,
                yd2: 836127,
                acre: 4046856422.4,
                hectare: 10000000000
            },
            volume: {
                mm3: 1,
                cm3: 1000,
                m3: 1000000000,
                l: 1000000,
                ml: 1000,
                in3: 16387,
                ft3: 28316846,
                gal: 3785411.78,
                qt: 946352.95,
                pt: 473176.47,
                cup: 236588.24
            },
            speed: {
                'm/s': 1,
                'km/h': 0.277778,
                'mph': 0.44704,
                'ft/s': 0.3048,
                'knot': 0.514444
            },
            data: {
                b: 1,
                kb: 1024,
                mb: 1048576,
                gb: 1073741824,
                tb: 1099511627776,
                pb: 1125899906842624
            },
            time: {
                s: 1,
                min: 60,
                h: 3600,
                d: 86400,
                w: 604800,
                month: 2629746,
                year: 31556952
            }
        },
        
        /**
         * 转换单位
         * @param {number} value - 要转换的值
         * @param {string} fromUnit - 源单位
         * @param {string} toUnit - 目标单位
         * @param {string} type - 转换类型
         * @returns {number} - 转换结果
         */
        convert(value, fromUnit, toUnit, type) {
            if (type === 'temperature') {
                return this.convertTemperature(value, fromUnit, toUnit);
            }
            
            const rates = this.conversionRates[type];
            if (!rates) throw new Error('未知的转换类型');
            
            const fromRate = rates[fromUnit];
            const toRate = rates[toUnit];
            
            if (fromRate === undefined || toRate === undefined) {
                throw new Error('未知的单位');
            }
            
            // 先转换为基准单位，再转换为目标单位
            return (value * fromRate) / toRate;
        },
        
        /**
         * 温度转换
         * @param {number} value - 温度值
         * @param {string} fromUnit - 源单位
         * @param {string} toUnit - 目标单位
         * @returns {number} - 转换结果
         */
        convertTemperature(value, fromUnit, toUnit) {
            // 先转换为摄氏度
            let celsius;
            switch (fromUnit) {
                case 'c':
                    celsius = value;
                    break;
                case 'f':
                    celsius = (value - 32) * 5/9;
                    break;
                case 'k':
                    celsius = value - 273.15;
                    break;
                case 'r':
                    celsius = (value - 491.67) * 5/9;
                    break;
                default:
                    throw new Error('未知的温度单位');
            }
            
            // 再从摄氏度转换为目标单位
            switch (toUnit) {
                case 'c':
                    return celsius;
                case 'f':
                    return celsius * 9/5 + 32;
                case 'k':
                    return celsius + 273.15;
                case 'r':
                    return (celsius + 273.15) * 9/5;
                default:
                    throw new Error('未知的温度单位');
            }
        }
    },
    
    // 数据可视化工具
    dataVisualization: {
        /**
         * 创建图表
         * @param {string} type - 图表类型
         * @param {Object} data - 图表数据
         * @param {HTMLCanvasElement} canvas - Canvas元素
         * @param {Object} options - 选项
         * @returns {Chart} - Chart.js图表实例
         */
        createChart(type, data, canvas, options = {}) {
            const ctx = canvas.getContext('2d');
            
            const chartOptions = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: !!options.title,
                        text: options.title,
                        font: {
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    legend: {
                        display: type !== 'pie' && type !== 'doughnut',
                        position: 'top'
                    }
                },
                scales: type === 'pie' || type === 'doughnut' || type === 'polarArea' ? {} : {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    }
                }
            };
            
            return new Chart(ctx, {
                type,
                data,
                options: chartOptions
            });
        },
        
        /**
         * 生成随机数据
         * @param {number} count - 数据点数量
         * @param {number} min - 最小值
         * @param {number} max - 最大值
         * @returns {Array} - 随机数据数组
         */
        generateRandomData(count, min, max) {
            const data = [];
            for (let i = 0; i < count; i++) {
                data.push(Math.floor(Math.random() * (max - min + 1)) + min);
            }
            return data;
        },
        
        /**
         * 生成图表颜色
         * @param {number} count - 颜色数量
         * @returns {Array} - 颜色数组
         */
        generateChartColors(count) {
            const colors = [
                '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
                '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1',
                '#14B8A6', '#F43F5E', '#EAB308', '#10B981', '#6366F1'
            ];
            
            const result = [];
            for (let i = 0; i < count; i++) {
                result.push(colors[i % colors.length]);
            }
            
            return result;
        }
    }
};

// 通用工具函数
const Utils = {
    /**
     * 显示通知
     * @param {string} message - 通知消息
     * @param {string} type - 通知类型 (success, error, warning, info)
     */
    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fa fa-${this.getNotificationIcon(type)} notification-icon"></i>
                <span class="notification-message">${message}</span>
            </div>
            <button class="notification-close">
                <i class="fa fa-times"></i>
            </button>
        `;
        
        // 添加到页面
        document.body.appendChild(notification);
        
        // 显示动画
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // 自动关闭
        const timer = setTimeout(() => {
            this.hideNotification(notification);
        }, 3000);
        
        // 关闭按钮事件
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(timer);
            this.hideNotification(notification);
        });
    },
    
    /**
     * 获取通知图标
     * @param {string} type - 通知类型
     * @returns {string} - 图标类名
     */
    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    },
    
    /**
     * 隐藏通知
     * @param {HTMLElement} notification - 通知元素
     */
    hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    },
    
    /**
     * 复制到剪贴板
     * @param {string} text - 要复制的文本
     * @returns {Promise<boolean>} - 是否复制成功
     */
    async copyToClipboard(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
            } else {
                // 降级方案
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                return successful;
            }
        } catch (error) {
            console.error('复制失败:', error);
            return false;
        }
    },
    
    /**
     * 下载文件
     * @param {string} content - 文件内容
     * @param {string} filename - 文件名
     * @param {string} contentType - 内容类型
     */
    downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    }
};

// 页面加载完成后初始化通知样式
document.addEventListener('DOMContentLoaded', () => {
    // 创建通知样式
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            min-width: 300px;
            max-width: 400px;
            padding: 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            justify-content: space-between;
            z-index: 1000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        }
        
        .notification.show {
            opacity: 1;
            transform: translateX(0);
        }
        
        .notification-success {
            background-color: #dcfce7;
            border-left: 4px solid #16a34a;
        }
        
        .notification-error {
            background-color: #fee2e2;
            border-left: 4px solid #dc2626;
        }
        
        .notification-warning {
            background-color: #fef3c7;
            border-left: 4px solid #d97706;
        }
        
        .notification-info {
            background-color: #dbeafe;
            border-left: 4px solid #2563eb;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            flex: 1;
        }
        
        .notification-icon {
            margin-right: 12px;
            font-size: 20px;
        }
        
        .notification-success .notification-icon {
            color: #16a34a;
        }
        
        .notification-error .notification-icon {
            color: #dc2626;
        }
        
        .notification-warning .notification-icon {
            color: #d97706;
        }
        
        .notification-info .notification-icon {
            color: #2563eb;
        }
        
        .notification-message {
            font-size: 14px;
            line-height: 1.4;
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: 16px;
            cursor: pointer;
            padding: 4px;
            margin-left: 12px;
            color: #6b7280;
            border-radius: 4px;
            transition: background-color 0.2s;
        }
        
        .notification-close:hover {
            background-color: rgba(0, 0, 0, 0.05);
        }
        
        @media (max-width: 640px) {
            .notification {
                left: 20px;
                right: 20px;
                min-width: auto;
                max-width: none;
            }
        }
    `;
    
    document.head.appendChild(style);
});

// 初始化主题
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // 设置初始主题
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', initialTheme);
});