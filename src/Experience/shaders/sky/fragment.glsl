uniform float uMinY;
uniform float uMaxY;
uniform float uMinZ;
uniform float uMaxZ;
uniform sampler2D uSkyTexture;
varying vec3 vPosition;
varying vec2 vUv;

vec2 scaleUV(vec2 uv, float scale) {
    float center = 0.5;
    return ((uv - center) * scale) + center;
}

void main() {
    vec2 offsetUV = vec2(vUv.x + 0.025, vUv.y - 0.0015);

    // 1. Ambil warna asli dari tekstur
    vec3 skyTexture = texture2D(uSkyTexture, scaleUV(offsetUV, 15.0)).rgb;

    // 2. Modifikasi warna menjadi Hitam-Ungu
    // Kita buat warna Ungu Neon (Purple/Violet)
    vec3 purpleColor = vec3(0.5, 0.0, 1.0); // Warna Ungu Dasar
    
    // Campurkan tekstur asli dengan warna ungu, lalu gelapkan (Hitam)
    // Perkalian dengan 0.2 membuat nuansanya sangat gelap (hitam keunguan)
    skyTexture = mix(skyTexture, purpleColor, 0.6) * 0.2;

    if (
        vPosition.y >= uMinY && vPosition.y <= uMaxY &&
        vPosition.x >= uMinZ && vPosition.x <= uMaxZ
    ) {
        gl_FragColor = vec4(skyTexture, 1.0);
    } else {
        discard;
    }
}
