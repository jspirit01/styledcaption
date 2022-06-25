import Pitchfinder from 'pitchfinder'
import { Waveform, Frequency } from 'tone'
import * as Tone from 'tone'

export class Pitch {
	constructor(source){

		this._analyser = new Waveform(1024)
		//source.connect(this._analyser)
        Tone.connect(source, this._analyser)
        

		this._pichfinder = Pitchfinder.Macleod({ sampleRate : Tone.context.sampleRate })

		this._smoothedPitches = []

		this._smoothedProb = 0
	}

	_getMedian(){
		return this._smoothedPitches.slice().sort()[Math.floor(this._smoothedPitches.length/2)]
	}

	getPitch(){
		const values = this._analyser.getValue()
		let { freq, probability } = this._pichfinder(values)
        console.log(freq)
		//some smoothing
		if (freq < 30){
			probability = 0
		} 
		//different decending/acending curve
		const smoothing = probability > this._smoothedProb ? 0.8 : 0.99
		this._smoothedProb = this._smoothedProb * smoothing + probability * (1 - smoothing)

		this._smoothedPitches.push(freq)
		if (this._smoothedPitches.length > 20){
			this._smoothedPitches.shift()
		}

		const pitch = this._getMedian()

		const note = pitch === -1 ? 0 : Frequency(pitch).toNote()
		const midi = pitch === -1 ? 0 : Frequency(pitch).toMidi()

		return {
			frequency : pitch,
			confidence : this._smoothedProb,
			note, midi
		}
	}

    getLastNode(){
        return this._analyser
    }
}
