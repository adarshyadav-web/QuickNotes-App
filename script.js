document.addEventListener('DOMContentLoaded', () => {
    const notesGrid = document.getElementById('notes-grid');
    const addNoteBtn = document.getElementById('add-note-btn');
    const noteTemplate = document.getElementById('note-template');

    // Load notes from LocalStorage
    let notes = JSON.parse(localStorage.getItem('quicknotes')) || [];

    function saveNotes() {
        localStorage.setItem('quicknotes', JSON.stringify(notes));
    }

    function createNoteElement(id, content, color, timestamp) {
        const noteClone = noteTemplate.content.cloneNode(true);
        const noteDiv = noteClone.querySelector('.note');
        const textarea = noteClone.querySelector('.note-body');
        const deleteBtn = noteClone.querySelector('.delete-btn');
        const colorDots = noteClone.querySelectorAll('.color-dot');
        const timeSpan = noteClone.querySelector('.timestamp');

        noteDiv.style.backgroundColor = color;
        textarea.value = content;
        timeSpan.textContent = timestamp;

        // Color picking logic
        colorDots.forEach(dot => {
            if (dot.dataset.color === color) dot.classList.add('active');
            else dot.classList.remove('active');

            dot.addEventListener('click', () => {
                const newColor = dot.dataset.color;
                noteDiv.style.backgroundColor = newColor;
                colorDots.forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
                
                // Update in array
                const index = notes.findIndex(n => n.id === id);
                if (index > -1) {
                    notes[index].color = newColor;
                    saveNotes();
                }
            });
        });

        // Content update logic
        textarea.addEventListener('input', () => {
            const index = notes.findIndex(n => n.id === id);
            if (index > -1) {
                notes[index].content = textarea.value;
                saveNotes();
            }
        });

        // Delete logic
        deleteBtn.addEventListener('click', () => {
            if (confirm('Delete this note?')) {
                notes = notes.filter(n => n.id !== id);
                saveNotes();
                noteDiv.remove();
            }
        });

        return noteClone;
    }

    function renderNotes() {
        notesGrid.innerHTML = '';
        notes.forEach(note => {
            const noteEl = createNoteElement(note.id, note.content, note.color, note.timestamp);
            notesGrid.appendChild(noteEl);
        });
    }

    addNoteBtn.addEventListener('click', () => {
        const newNote = {
            id: Date.now(),
            content: '',
            color: '#fff9c4',
            timestamp: new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })
        };
        notes.unshift(newNote);
        saveNotes();
        const noteEl = createNoteElement(newNote.id, newNote.content, newNote.color, newNote.timestamp);
        notesGrid.insertBefore(noteEl, notesGrid.firstChild);
    });

    renderNotes();
});
