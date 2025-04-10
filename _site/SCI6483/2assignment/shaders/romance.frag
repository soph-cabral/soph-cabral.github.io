#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_frequencyData[256]; 


float colormap_red(float x) {
    if (x < 0.0) {
        return 54.0 / 255.0;
    } else if (x < 20049.0 / 82979.0) {
        return (829.79 * x + 10.51) / 255.0;
    } else {
        return 1.0;
    }
}

float colormap_green(float x) {
    if (x < 20049.0 / 82979.0) {
        return 0.0;
    } else if (x < 327013.0 / 810990.0) {
        return (8546482679670.0 / 10875673217.0 * x - 2064961390770.0 / 10875673217.0) / 255.0;
    } else if (x <= 1.0) {
        return (103806720.0 / 483977.0 * x + 19607415.0 / 483977.0) / 255.0;
    } else {
        return 1.0;
    }
}

float colormap_blue(float x) {
    if (x < 0.0) {
        return 54.0 / 255.0;
    } else if (x < 7249.0 / 82979.0) {
        return (829.79 * x + 54.51) / 255.0;
    } else if (x < 20049.0 / 82979.0) {
        return 127.0 / 255.0;
    } else if (x < 327013.0 / 810990.0) {
        return (792.02249341361393720147485376583 * x - 64.364790735602331034989206222672) / 255.0;
    } else {
        return 1.0;
    }
}

vec4 colormap(float x) {
    float red = colormap_red(x);
    float green = colormap_green(x);
    float blue = colormap_blue(x);

    // Adjust the color components for a more blue tone
    red *= u_frequencyData[0] * 0.003;
    green *= u_frequencyData[0] * 0.03;
    blue *= u_frequencyData[0] * 0.028;
    return vec4(red, green, blue, 1.0);
}

float rand(vec2 n) { 
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u*u*(3.0-2.0*u);

    float res = mix(
        mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
        mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
    return res*res;
}

const mat2 mtx = mat2( 0.80,  0.60, -0.60,  0.80 );

float fbm( vec2 p )
{
    float f = 0.0;

    f += 0.500000 * noise( p + 0.2 * u_time ); p = mtx * p * 2.02;
    f += 0.031250 * noise( p ); p = mtx * p * 2.01;
    f += 0.250000 * noise( p ); p = mtx * p * 2.03;
    f += 0.125000 * noise( p ); p = mtx * p * 2.01;
    f += 0.062500 * noise( p ); p = mtx * p * 2.04;
    f += 0.015625 * noise( p + sin(0.4 * u_time) );
    return f/0.96875;
}

float pattern(in vec2 p) {
    return fbm(p + fbm(p + fbm(p)));
}

void top_effect(out vec4 fragColor, in vec2 fragCoord) {
    vec2 p = (fragCoord - 0.5 * u_resolution) / u_resolution.y; //normalize position

    float l = length(p); //distance from center

    // distort UV coordinates with a sine wave
    vec2 uv = p + 0.1 * vec2(sin(u_time * 0.1), sin(u_time * 0.2)) * l * 0.2 * u_frequencyData[0]*0.01;
    uv.x *= u_resolution.x / u_resolution.y;
    uv += p / l * (cos(u_time * 0.5) + u_frequencyData[0] * 0.008) * abs(cos(l * 15.0 - u_time * 0.1));

    //top color effect
    //vec3 c0 = vec3(0.005 / length(fract(uv)) / l);
    vec3 c1 = vec3(0.005 / length(fract(uv) - 0.5) / l);
    vec3 c2 = vec3(u_frequencyData[0] * 0.00001 / length(fract(uv) - 0.5) / l, 
                u_frequencyData[0] * 0.00005 / length(fract(uv) - 0.1) / l,
                u_frequencyData[0] * 0.000002 / length(fract(uv) - 0.8) / l);

    vec2 textureUV = fragCoord.xy / u_resolution.xy;
    float wave = pattern(textureUV);
    vec3 patternColor = colormap(wave).rgb;

    fragColor.rgb = c2*0.1 + patternColor + c1;
    fragColor.a = 1.0;
}



void main() {
    top_effect(gl_FragColor, gl_FragCoord.xy);
}
