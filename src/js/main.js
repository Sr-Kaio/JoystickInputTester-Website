const connectedPage = document.getElementById("connectedPage")
const disconnectedPage = document.getElementById("disconnectedPage")
var buttons_ = [
    'BBottom','BLeft','BRight','BTop',
    'L1','R1','L2','R2',
    'LMeta','RMeta','LeftStick','RightStick','DUp','DDown','DLeft','DRight'
]

let controllerIndex = null;

window.addEventListener("gamepadconnected", (e) => {
    const gamepad = e.gamepad;

    controllerIndex = gamepad.index;

    console.log(
      gamepad
    );

    disconnectedPage.classList.remove("fadein");
    disconnectedPage.classList.add("fadeout");
    document.getElementById("press-any").innerHTML = "Connected!"
     disconnectedPage.addEventListener('animationend', () => {
        disconnectedPage.style.display = "none"
        connectedPage.style.display = "flex"
    });
    const ControllerInfoText = document.getElementById("controller-info");
    ControllerInfoText.innerHTML = e.gamepad.id;
});

window.addEventListener("gamepaddisconnected", (e) => {
    disconnectedPage.classList.remove("fadeout");
    document.getElementById("press-any").innerHTML = "Disconnected, Press any button on the gamepad to Start"
    disconnectedPage.style.display = "flex"
    connectedPage.style.display = "none"
});

function handleAxes(elementID, left, up) {
    const multiplier = 10;
    const stickHorizontal = left * multiplier
    const stickVertical = up * multiplier

    const stick = document.getElementById(elementID)

    const x = Number(stick.dataset.originalCx)
    const y = Number(stick.dataset.originalCy)

    stick.setAttribute("cy", y + stickVertical)
    stick.setAttribute("cx", x + stickHorizontal)
}
function lerp( a, b, alpha ) {
    return a + alpha * ( b - a )
}
let last = 0

function gameLoop() {
    if(controllerIndex != null) {
        const gamepad = navigator.getGamepads()[controllerIndex]
        for (let index = 0; index < gamepad.buttons.length; index++) {
            const button = gamepad.buttons[index];
            const buttonElementName = buttons_[index]
            const buttonElement = document.getElementById(buttonElementName);
    
            if(buttonElement) {
                switch (buttonElementName) {
                    case "LeftStick":
                        
                        buttonElement.setAttribute("fill", "rgba(123, 47, 255," + (Math.max(0, button.value/1.5 + -.2 + 1.2 * Math.sqrt(Math.pow(gamepad.axes[0], 2) + Math.pow(gamepad.axes[1], 2)))) + ")");
                        break;
                        case "RightStick":
                            buttonElement.setAttribute("fill", "rgba(123, 47, 255," +  (Math.max(0, button.value/1.5 + -.2 + 1.2 * Math.sqrt(Math.pow(gamepad.axes[2], 2) + Math.pow(gamepad.axes[3], 2)))) + ")");
                            
                        break;
                    default:
                
                        buttonElement.setAttribute("fill", "rgba(123, 47, 255," + button.value + ")");
                        break;
                }
              
                for (const child of buttonElement.children) {
                    if (child.tagName == "path" || child.tagName == "circle")
                        child.setAttribute("fill", "rgba(123, 47, 255," + button.value + ")");
                }
            }
        }

        handleAxes("LeftStick", gamepad.axes[0], gamepad.axes[1])
        handleAxes("RightStick", gamepad.axes[2], gamepad.axes[3])

    }
    requestAnimationFrame(gameLoop);
}

gameLoop();