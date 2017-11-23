import { eventChannel } from "redux-saga";
import { takeEvery, take, call, put } from "redux-saga/effects";

const APP_MOUNTED = "app/APP_MOUNTED";
const MIDI_UNSUPPORTED = "app/MIDI_UNSUPPORTED";
const MIDI_NOTE_ON = "app/MIDI_NOTE_ON";
const MIDI_NOTE_OFF = "app/MIDI_NOTE_OFF";

const initialState = {
  errors: [],
  notes: {}
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case MIDI_UNSUPPORTED:
      return {
        ...state,
        errors: state.errors.concat(
          "Midi input is not supported in your browser"
        )
      };
    case MIDI_NOTE_ON: {
      return {
        ...state,
        notes: {
          ...state.notes,
          [action.payload.note]: action.payload.velocity
        }
      };
    }
    case MIDI_NOTE_OFF: {
      const newNotes = { ...state.notes };
      delete newNotes[action.payload.note];
      return {
        ...state,
        notes: newNotes
      };
    }
    default:
      return state;
  }
};

export const appMounted = () => ({
  type: APP_MOUNTED
});

function* onMidiMessage({ data }) {
  const [type, note, velocity] = data;

  switch (type) {
    case 144:
      yield put({ type: MIDI_NOTE_ON, payload: { note, velocity } });
      break;
    case 128:
      yield put({ type: MIDI_NOTE_OFF, payload: { note } });
      break;
    default:
  }
}

function createMidiEventChannel(midiAccess) {
  return eventChannel(emitter => {
    const inputs = midiAccess.inputs.values();
    for (
      var input = inputs.next();
      input && !input.done;
      input = inputs.next()
    ) {
      // each time there is a midi message call the onMIDIMessage function
      input.value.onmidimessage = emitter;
    }
    return () => {
      //;
    };
  });
}

function* onMidiSuccess(midiAccess) {
  const channel = yield call(createMidiEventChannel, midiAccess);

  while (true) {
    const message = yield take(channel);
    yield call(onMidiMessage, message);
  }
}

function* appMountedSaga() {
  if (window.navigator.requestMIDIAccess) {
    try {
      const midiAccess = yield call(
        [window.navigator, window.navigator.requestMIDIAccess],
        {
          sysex: false
        }
      );
      yield call(onMidiSuccess, midiAccess);
    } catch (error) {
      yield put({ type: MIDI_UNSUPPORTED });
      console.error(error);
    }
  }
}

export const appSagas = [takeEvery(APP_MOUNTED, appMountedSaga)];
