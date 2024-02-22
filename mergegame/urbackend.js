


document.getElementById("human").addEventListener("click", function() {makeitem("human");});
document.getElementById("emotion").addEventListener("click", function() {makeitem("emotion");});
document.getElementById("water").addEventListener("click", function() {makeitem("water");});
document.getElementById("air").addEventListener("click", function() {makeitem("air");});



  
function makeitem (whatto) {
    console.log("hi");
    let bodx = document.getElementsByClassName("urbody")[0];
    const x = document.createElement('button');
    x.innerText = whatto;
    bodx.appendChild(x);
    let posX = 0, posY = 0, mouseX = 0, mouseY = 0;


    x.addEventListener('mousedown', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        posX = x.offsetLeft;
        posY = x.offsetTop;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        checkCollision(x);
    });

    function onMouseMove(e) {
        const dx = e.clientX - mouseX;
        const dy = e.clientY - mouseY;
        x.style.position = 'absolute'; 
        x.style.left = posX + dx + 'px';
        x.style.top = posY + dy + 'px';
        
    }

    function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }
}
async function fetchOpenAIResponse(prompt) {
    console.log("completion")
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer GO GET UR OWN KEY`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo", 
                messages: [{role: 'user', content: prompt}],
                max_tokens: 50,
                temperature: 1.3
            })
        });

        const data = await response.json();
        return data.choices[0].message;
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        return null; 
    }
}

// Example usage

let isCheckingCollision = false; 

async function checkCollision(btn) {
    if (isCheckingCollision) return; 
    isCheckingCollision = true; 

    let collided = false; 

    let buttons = document.querySelectorAll('button');
    for (let otherBtn of buttons) {
        if (otherBtn !== btn) {
            let btnRect = btn.getBoundingClientRect();
            let otherBtnRect = otherBtn.getBoundingClientRect();
            if (btnRect.left < otherBtnRect.right && btnRect.right > otherBtnRect.left &&
                btnRect.top < otherBtnRect.bottom && btnRect.bottom > otherBtnRect.top) {
                
                let prompt = `what does ${btn.innerText} + ${otherBtn.innerText} equal to? the result should be the outcome of what one does to the other (ex: dog + human = dogwalker, mob + fire = riot, car + human + jfk = assasain) (only return what it equals to (ex dog) (do not use other words besides the ones given for initial input, please be very creative and funny in a dry meme culture centered way)) `;
                const responseText = await fetchOpenAIResponse(prompt);
                otherBtn.remove();
                collided = true;
                btn.innerText = responseText.content;
                let todive = document.getElementsByClassName("items")[0];
                const toap = document.createElement('button');
                toap.innerText = responseText.content;
                toap.addEventListener("click", function() {makeitem(responseText.content);});
                todive.appendChild(toap);
                
                break;
            }
        }
    }

    setTimeout(() => {
        isCheckingCollision = false; 
    }, 1000); 

    return collided; 
}

