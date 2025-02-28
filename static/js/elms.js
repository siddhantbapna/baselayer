function header(){

    var header = `
        <div class="flex flex-x-center flex-y-bottom">
            <h1><a href="/dashboard" class="breadcrumb-link">Study.AI</a></h1>
            <span id="breadcrumbs" class=""></span>
        </div>
        <div class=""></div>
        <div class="flex flex-right flex-grow-1">
            <svg id="sbmusic" class="nb" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                fill="#1f1f1f">
                <path
                    d="M400-120q-66 0-113-47t-47-113q0-66 47-113t113-47q23 0 42.5 5.5T480-418v-422h240v160H560v400q0 66-47 113t-113 47Z" />
            </svg>
            <svg class="nb" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                fill="#1f1f1f">
                <path
                    d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" />
            </svg>
        </div>`

    var musicPopup = `
        <div class="popup" id="sbmusicplayer">
            <div class="popup-header">
                <h3>Music</h3>
            </div>

            <div class="sound-control">
                <div class="now-playing">
                    <span class="sound-name">Select A Music</span>
                </div>
                <button class="play-pause-btn" aria-label="Play/Pause sound">
                    <svg class="play-icon" viewBox="0 0 24 24" width="24" height="24">
                        <path fill="currentColor" d="M8 5v14l11-7z"/>
                    </svg>
                    <svg class="pause-icon hidden" viewBox="0 0 24 24" width="24" height="24">
                        <path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                    </svg>
                </button>
            </div>

            <div class="sound-options"></div>

            <audio id="audio-player">
                Your browser does not support the audio element.
            </audio>

            <div class="volume-control">
                <div class="volume-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -1060 960 960" width="24px" fill="#e3e3e3"><path d="M560-131v-82q90-26 145-100t55-168q0-94-55-168T560-749v-82q124 28 202 125.5T840-481q0 127-78 224.5T560-131ZM120-360v-240h160l200-200v640L280-360H120Zm440 40v-322q47 22 73.5 66t26.5 96q0 51-26.5 94.5T560-320ZM400-606l-86 86H200v80h114l86 86v-252ZM300-480Z"/></svg>
                </div>
                <input type="range" min="0" max="100" value="50" class="volume-slider">
            </div>

        </div>

        `

    document.querySelector("header").innerHTML = header + musicPopup

    function generateBreadcrumbs() {

        const path = window.location.pathname;
        const segments = path.split('/').filter(segment => segment !== '');

        let breadcrumbs = [];
    
        segments.forEach((segment, index) => {
          const url = '/' + segments.slice(0, index + 1).join('/');
          breadcrumbs.push(` <span>/</span><a href="${url}" class="breadcrumb-link">${segment}</a>`);
        });
    
        document.getElementById('breadcrumbs').innerHTML = breadcrumbs.join('');
      }
    
      generateBreadcrumbs();
    

}

header()

function main(){

}