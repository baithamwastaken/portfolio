<template>
  <span class="whitespace-pre font-sans text-7xl md:text-9xl text-white text-center">
    {{ displayedText }}
    <span v-if="showCursor" :class="cursorClass">|</span>
  </span>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  phrases: { type: Array, default: () => ['Haitham Iswed'] },
  typingSpeed: { type: Number, default: 80 },    // ms per letter
  deletingSpeed: { type: Number, default: 40 },  // ms per letter
  pauseAfterTyping: { type: Number, default: 1200 }, // ms pause after typing
  pauseAfterDeleting: { type: Number, default: 500 }, // ms pause after deleting
  loop: { type: Boolean, default: true },
  cursor: { type: Boolean, default: true },
  cursorBlink: { type: Boolean, default: true }
});

const displayedText = ref('');
const showCursor = ref(props.cursor);
const cursorClass = props.cursorBlink ? 'animate-pulse' : '';

let interval = null;
let phraseIndex = 0;
let isDeleting = false;

const typeLoop = async () => {
  const phrase = props.phrases[phraseIndex];
  if (!isDeleting) {
    // Typing
    if (displayedText.value.length < phrase.length) {
      displayedText.value = phrase.slice(0, displayedText.value.length + 1);
      interval = setTimeout(typeLoop, props.typingSpeed);
    } else {
      // Pause after typing
      interval = setTimeout(() => {
        isDeleting = true;
        typeLoop();
      }, props.pauseAfterTyping);
    }
  } else {
    // Deleting
    if (displayedText.value.length > 0) {
      displayedText.value = phrase.slice(0, displayedText.value.length - 1);
      interval = setTimeout(typeLoop, props.deletingSpeed);
    } else {
      // Pause after deleting
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % props.phrases.length;
      if (!props.loop && phraseIndex === 0) {
        showCursor.value = false;
        return;
      }
      interval = setTimeout(typeLoop, props.pauseAfterDeleting);
    }
  }
};

onMounted(() => {
  typeLoop();
});

watch(() => props.phrases, () => {
  clearTimeout(interval);
  displayedText.value = '';
  phraseIndex = 0;
  isDeleting = false;
  showCursor.value = props.cursor;
  typeLoop();
});
</script> 