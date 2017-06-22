play = function (filename) {
        console.log(filename);
        wavesurfer.load('/media/' + filename);
        wavesurfer.play();
    };

$(document).ready(function() {

    wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'snow',
        progressColor: 'grey',
        backend: 'MediaElement',
        // barWidth: 50,
        height: 75,
        hideScrollbar: true
    });

});
