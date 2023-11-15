//script.js

//CORE

let blockCounter = 0;

// Función para agregar un bloque al hacer clic en el botón
document.getElementById('add-block').addEventListener('click', function() {
    blockCounter++;
    const newBlock = document.createElement('div');
    newBlock.id = 'editable-block-' + blockCounter;
    newBlock.className = 'editable-block align-items-start d-flex width-100';
    
    const editableContent = document.createElement('div');
    editableContent.contentEditable = true;
    editableContent.className = 'editable-content border p-3 mb-3 flex-grow-1';
    editableContent.innerHTML = '<div>Nuevo bloque</div>'; 
    newBlock.appendChild(editableContent);

    // Crear contenedor para los botones
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'd-flex'; 

    // Agregar botones de eliminar y mover
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'X'; //eliminar
    deleteButton.className = 'btn btn-sm btn-danger mx-1'; 
    deleteButton.dataset.action = 'delete'; 
    buttonContainer.appendChild(deleteButton);

    const moveUpButton = document.createElement('button');
    moveUpButton.innerHTML = '↑'; //mover arriba
    moveUpButton.className = 'btn btn-sm btn-secondary mx-1'; 
    moveUpButton.dataset.action = 'move-up'; 
    buttonContainer.appendChild(moveUpButton);

    const moveDownButton = document.createElement('button');
    moveDownButton.innerHTML = '↓'; //mover abajo
    moveDownButton.className = 'btn btn-sm btn-secondary mx-1'; 
    moveDownButton.dataset.action = 'move-down'; 
    buttonContainer.appendChild(moveDownButton);

    // Agregar botón "Ver Código"  
    const viewCodeButton = document.createElement('button');
    viewCodeButton.innerHTML = 'Ver Código'; //ver código
    viewCodeButton.className = 'btn btn-sm btn-primary mx-1'; 
    viewCodeButton.dataset.action = 'view-code'; 
    buttonContainer.appendChild(viewCodeButton);

    // Agregar botón "Ver Diseño"
    const viewDesignButton = document.createElement('button');
    viewDesignButton.innerHTML = 'Ver Diseño'; //ver diseño
    viewDesignButton.className = 'btn btn-sm btn-primary mx-1'; 
    viewDesignButton.dataset.action = 'view-design'; 
    buttonContainer.appendChild(viewDesignButton);
    

    newBlock.appendChild(buttonContainer);
    
    document.getElementById('editor').appendChild(newBlock);
    
    saveState();  // Guardar estado después de agregar un bloque

    editableContent.addEventListener('input', saveState);  // Guardar estado después de editar un bloque
});

// Función para ver el código en el contenedor editable
function viewCode(blockId) {
    const block = document.getElementById(blockId);
    const editableContent = block.querySelector('.editable-content');
    const code = editableContent.innerHTML;
    
    // Escapar caracteres especiales en el código HTML
    const escapedCode = code.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
    
    // Reemplazar el contenido del bloque editable con el código escapado
    editableContent.textContent = escapedCode;
}



// Función para ver el diseño
function viewDesign(blockId) {
    const block = document.getElementById(blockId);
    const editableContent = block.querySelector('.editable-content');
    
    // Reemplazar el contenido del bloque editable con el código original
    editableContent.innerHTML = editableContent.textContent;
}


// Agregar un evento para los botones "Ver Código" y "Ver Diseño"
document.getElementById('editor').addEventListener('click', function(event) {
    const target = event.target;
    if (target && target.dataset.action === 'view-code') {
        const blockId = target.closest('.editable-block').id;
        viewCode(blockId);
    } else if (target && target.dataset.action === 'view-design') {
        const blockId = target.closest('.editable-block').id;
        viewDesign(blockId);
    }
});


document.getElementById('editor').addEventListener('click', function(event) {
    const action = event.target.dataset.action;
    const block = getSelectedBlock(event.target); // Usar la función getSelectedBlock

    if (action === 'delete') {
        block.remove();
        saveState();
    } else if (action === 'move-up' && block.previousElementSibling) {
        block.parentNode.insertBefore(block, block.previousElementSibling);
        saveState();
    } else if (action === 'move-down' && block.nextElementSibling) {
        block.parentNode.insertBefore(block.nextElementSibling, block);
        saveState();
    }
});

// Función para guardar el contenido del editor
document.getElementById('save-button').addEventListener('click', function() {
   const content = document.getElementById('editor').innerHTML;
   localStorage.setItem('savedContent', content);
});

// Función para cargar el contenido guardado
document.getElementById('load-button').addEventListener('click', function() {
   const savedContent = localStorage.getItem('savedContent');
   if (savedContent) {
       document.getElementById('editor').innerHTML = savedContent;
       saveState();
   }
});


let history = [];
let historyIndex = -1;

// Función para guardar el estado actual en el historial
function saveState() {
   const content = document.getElementById('editor').innerHTML;
   history.push(content);
   historyIndex++;
}

// Función para deshacer el último cambio
document.getElementById('undo-button').addEventListener('click', function() {
   if (historyIndex > 0) {
       historyIndex--;
       document.getElementById('editor').innerHTML = history[historyIndex];
   }
});

// Función para rehacer el último cambio deshecho
document.getElementById('redo-button').addEventListener('click', function() {
   if (historyIndex < history.length - 1) {
       historyIndex++;
       document.getElementById('editor').innerHTML = history[historyIndex];
   }
});



document.getElementById('bold-button').addEventListener('click', function() {
    document.execCommand('bold');
});

document.getElementById('italic-button').addEventListener('click', function() {
    document.execCommand('italic');
});

document.getElementById('underline-button').addEventListener('click', function() {
    document.execCommand('underline');
});

document.getElementById('text-color-picker').addEventListener('input', function() {
    const color = this.value;
    document.execCommand('foreColor', false, color);
});

document.getElementById('bg-color-picker').addEventListener('input', function() {
    const color = this.value;
    document.execCommand('hiliteColor', false, color);
});


function disableFormatButtons() {
    // Deshabilitar los botones de formato
    document.getElementById('bold-button').disabled = true;
    document.getElementById('italic-button').disabled = true;
    document.getElementById('underline-button').disabled = true;
    // Agrega otros botones de formato que quieras deshabilitar aquí
}

function enableFormatButtons() {
    // Habilitar los botones de formato
    document.getElementById('bold-button').disabled = false;
    document.getElementById('italic-button').disabled = false;
    document.getElementById('underline-button').disabled = false;
    // Habilita otros botones de formato que hayas deshabilitado
}

// SECCIÓN DE EXPORTACIÓN

// Función para exportar el contenido del editor
function exportContent() {
    disableFormatButtons();
    const content = document.getElementById('editor').cloneNode(true);
    const buttons = content.querySelectorAll('.btn');
    buttons.forEach(button => button.remove());

    // Elimina la propiedad contentEditable y el borde del bloque en el contenido exportado
    const editableBlocks = content.querySelectorAll('.editable-content');
    editableBlocks.forEach(block => {
        block.removeAttribute('contentEditable');
        block.classList.remove('border');
    });

    const html = `<!DOCTYPE html>
    <html>
    <head>
        <title>Editor de Bloques HTML</title>
        <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
        <div class="container-fluid">
            <div class="row">
                <div class="col-10 py-3">
                    ${content.innerHTML}
                </div>
            </div>
        </div>
    </body>
    </html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'editor_content.html';
    a.click();
    URL.revokeObjectURL(url);
    enableFormatButtons();
}

// Agregar un evento para el botón de exportación
document.getElementById('export-button').addEventListener('click', exportContent);

// SECCIÓN DE PREVISUALIZACIÓN

// Función para previsualizar el contenido
function previewContent() {
    disableFormatButtons();
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => button.style.display = 'none');

    var previewWindow = window.open('', '_blank');

    previewWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Previsualización</title>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
        </head>
        <body>
            ${document.getElementById('editor').innerHTML}
        </body>
        </html>
    `);

    buttons.forEach(button => button.style.display = '');
    enableFormatButtons();
}

// Agregar un evento para el botón de previsualización
document.getElementById('preview-button').addEventListener('click', previewContent);


document.getElementById('clear-format-button').addEventListener('click', function() {
    // Código para limpiar el formato del texto seleccionado
    document.execCommand('removeFormat');
});

document.getElementById('save-template-button').addEventListener('click', function() {
    // Código para guardar como plantilla
    const content = document.getElementById('editor').innerHTML;
    localStorage.setItem('savedContent', content);
});

document.getElementById('import-input').addEventListener('change', function (event) {
    const file = event.target.files[0]; // Obtén el archivo seleccionado

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const importedContent = e.target.result; // Contenido del archivo importado

            // Analizar el contenido importado utilizando DOMParser
            const parser = new DOMParser();
            const parsedDocument = parser.parseFromString(importedContent, 'text/html');

            // Crear un contenedor para el bloque importado
            const newBlock = document.createElement('div');
            newBlock.className = 'editable-block align-items-start d-flex width-100 justify-content-between';

            // Crear el bloque editable
            const editableContent = document.createElement('div');
            editableContent.contentEditable = true;
            editableContent.className = 'editable-content border p-3 mb-3 flex-grow-1';

            // Agregar el contenido interno del body al bloque editable
            editableContent.innerHTML = parsedDocument.body.innerHTML;

            newBlock.appendChild(editableContent);

            // Crear contenedor para los botones
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'd-flex';

            // Agregar botones de eliminar y mover
            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = 'X'; // Eliminar
            deleteButton.className = 'btn btn-sm btn-danger mx-1';
            deleteButton.dataset.action = 'delete';
            buttonContainer.appendChild(deleteButton);

            const moveUpButton = document.createElement('button');
            moveUpButton.innerHTML = '↑'; // Mover arriba
            moveUpButton.className = 'btn btn-sm btn-secondary mx-1';
            moveUpButton.dataset.action = 'move-up';
            buttonContainer.appendChild(moveUpButton);

            const moveDownButton = document.createElement('button');
            moveDownButton.innerHTML = '↓'; // Mover abajo
            moveDownButton.className = 'btn btn-sm btn-secondary mx-1';
            moveDownButton.dataset.action = 'move-down';
            buttonContainer.appendChild(moveDownButton);

            // Agregar botón "Ver Código"
            const codeButton = document.createElement('button');
            codeButton.innerHTML = 'Ver Código'; // Ver código
            codeButton.className = 'btn btn-sm btn-primary mx-1';
            codeButton.dataset.action = 'code';
            buttonContainer.appendChild(codeButton);
            

            // Agregar botón "Ver Diseño"
            const designButton = document.createElement('button');
            designButton.innerHTML = 'Ver Diseño'; // Ver diseño
            designButton.className = 'btn btn-sm btn-primary mx-1';
            designButton.dataset.action = 'design';
            buttonContainer.appendChild(designButton);
            


            newBlock.appendChild(buttonContainer);

            // Agrega el nuevo bloque al editor
            document.getElementById('editor').appendChild(newBlock);

            saveState(); // Guarda el estado después de importar el contenido
        };

        reader.readAsText(file); // Lee el contenido del archivo como texto
    }
});



// Función para cambiar entre las vistas "visual" y "código"
function toggleBlockView(block) {
    const visualView = block.querySelector('.visual-view');
    const codeView = block.querySelector('.code-view');

    if (visualView.style.display === 'none') {
        // Cambiar a vista "visual"
        visualView.style.display = 'block';
        codeView.style.display = 'none';
    } else {
        // Cambiar a vista "código"
        visualView.style.display = 'none';
        codeView.style.display = 'block';
    }
}

// Manejar el evento de cambio de vista al hacer clic en el botón "Cambiar Vista"
document.getElementById('editor').addEventListener('click', function (event) {
    if (event.target.classList.contains('toggle-view')) {
        const block = getSelectedBlock(event.target);
        if (block) {
            toggleBlockView(block);
        }
    }
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




















//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Asociar eventos de clic a los botones de inserción
document.getElementById('insert-title-button').addEventListener('click', insertTitleWithText);
document.getElementById('insert-image-button').addEventListener('click', insertImageWithCaption);
document.getElementById('insert-gallery-button').addEventListener('click', insertGallery);
document.getElementById('insert-image-text-button').addEventListener('click', insertImageWithText);
document.getElementById('insert-button-button').addEventListener('click', insertButton);

// Función para insertar un bloque de Título con Texto
function insertTitleWithText() {
    blockCounter++;
    const newBlock = document.createElement('div');
    newBlock.className = 'editable-block';
    
    const title = document.createElement('h2');
    title.className = 'block-title';
    title.textContent = 'Título Destacado';
    
    const text = document.createElement('p');
    text.className = 'block-text';
    text.textContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae felis in ex ultrices lacinia.';
    
    newBlock.appendChild(title);
    newBlock.appendChild(text);

    document.getElementById('editor').appendChild(newBlock);
    saveState();
}

// Función para insertar un bloque de Imagen con Pie de Página
function insertImageWithCaption() {
    blockCounter++;
    const newBlock = document.createElement('div');
    newBlock.className = 'editable-block';
    
    const image = document.createElement('img');
    image.src = 'ruta-de-la-imagen.jpg';
    image.alt = 'Imagen de ejemplo';
    
    const caption = document.createElement('p');
    caption.className = 'block-footer';
    caption.textContent = 'Pie de página de la imagen';
    
    newBlock.appendChild(image);
    newBlock.appendChild(caption);

    document.getElementById('editor').appendChild(newBlock);
    saveState();
}

// Función para insertar un bloque de Galería de Imágenes con Descripciones
function insertGallery() {
    blockCounter++;
    const newBlock = document.createElement('div');
    newBlock.className = 'editable-block';

    const gallery = document.createElement('div');
    gallery.className = 'image-gallery';

    // Agrega aquí la estructura de las imágenes y descripciones

    newBlock.appendChild(gallery);
    document.getElementById('editor').appendChild(newBlock);
    saveState();
}

// Función para insertar un bloque de Imagen con Texto
function insertImageWithText() {
    blockCounter++;
    const newBlock = document.createElement('div');
    newBlock.className = 'editable-block';

    const image = document.createElement('img');
    image.src = 'ruta-de-la-imagen.jpg';
    image.alt = 'Imagen de ejemplo';

    const text = document.createElement('p');
    text.className = 'block-text';
    text.textContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam vitae felis in ex ultrices lacinia.';

    newBlock.appendChild(image);
    newBlock.appendChild(text);

    document.getElementById('editor').appendChild(newBlock);
    saveState();
}

// Función para insertar un bloque de Botón
function insertButton() {
    blockCounter++;
    const newBlock = document.createElement('div');
    newBlock.className = 'editable-block';

    const button = document.createElement('button');
    button.className = 'block-button';
    button.textContent = 'Botón';

    newBlock.appendChild(button);

    document.getElementById('editor').appendChild(newBlock);
    saveState();
}

// Función para obtener el bloque seleccionado
function getSelectedBlock(element) {
    while (element) {
        if (element.classList.contains('editable-block')) {
            return element;
        }
        element = element.parentElement;
    }
    return null;
}
