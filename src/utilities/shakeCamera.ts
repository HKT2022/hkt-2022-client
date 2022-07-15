const shakeAnimationCss = `
@keyframes shake {
    0% {
        transform: translate(0, 0);
    }
    10% {
        transform: translate(-10px, 0);
    }
    20% {
        transform: translate(10px, 0);
    }
    30% {
        transform: translate(-10px, 0);
    }
    40% {
        transform: translate(10px, 0);
    }
    50% {
        transform: translate(-10px, 0);
    }
    60% {
        transform: translate(10px, 0);
    }
    70% {
        transform: translate(-10px, 0);
    }
    80% {
        transform: translate(10px, 0);
    }
    90% {
        transform: translate(-10px, 0);
    }
    100% {
        transform: translate(0, 0);
    }
}`;

function shakeCamera(): void {
    const root = document.getElementById('root')!;
    root.style.animation = 'shake 0.5s';

    const style = document.createElement('style');
    style.innerHTML = shakeAnimationCss;
    root.appendChild(style);

    setTimeout(() => {
        root.style.animation = '';
        style.remove();
    }, 500);
}

export default shakeCamera;
