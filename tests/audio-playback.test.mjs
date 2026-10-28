import assert from 'node:assert/strict';
import {test} from 'node:test';
import {SoundEngine} from '../src/utils/audioHelper.js';

test('click and unlock effects cannot block a gift when Web Audio is unavailable',()=>{
  globalThis.window={};
  const sound=new SoundEngine();
  assert.doesNotThrow(()=>sound.playClick());
  assert.doesNotThrow(()=>sound.playUnlockSuccess());
  assert.doesNotThrow(()=>sound.playLaserHum(.5));
});

test('uploaded tracks play without starting the synthesized fallback; failed playback reports false',async()=>{
  globalThis.window={};let played=0;
  globalThis.Audio=class {
    constructor(src){this.src=src;this.paused=true;}
    play(){played++;this.paused=false;return Promise.resolve();}
    pause(){this.paused=true;}
  };
  const sound=new SoundEngine();let active=null;
  sound.toggleMusicTrack('https://storage.test/song.wav',value=>{active=value;});
  await Promise.resolve();assert.equal(played,1);assert.equal(active,true);assert.equal(sound.bgmInterval,null);
  sound.toggleMusicTrack('https://storage.test/song.wav',value=>{active=value;});
  assert.equal(active,false);
  sound.customAudioEl.play=()=>Promise.reject(new Error('Playback unavailable'));
  sound.toggleMusicTrack('https://storage.test/song.wav',value=>{active=value;});
  await Promise.resolve();await Promise.resolve();assert.equal(active,false);
});
