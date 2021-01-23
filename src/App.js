import React from 'react';
import logo from './logo.svg';
import './App.css';
import BluetoothService from './BluetoothService'

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      'isConnected':false,
      'overlay':{'type':'', 'display':false, 'title':'', 'message':'', 'modeName':''},
      'disconnectDisplay':{ 'display':'none' },
      'loading':false,
      'snapshot':undefined
    };
  }

  componentDidMount() {

  }

  setLoading = (value) => {
  }

  readCamera = () => {
    let url = 'http://192.168.1.89/capture';
    let resolutionUrl = 'http://192.168.1.89/control?var=framesize&val=8';

    window.setTimeout(() => {
      fetch(resolutionUrl).then()
      fetch(url)
      .then(response => response.blob())
      .then((result) => {
        let img = URL.createObjectURL(result);
        this.setState({ 'snapshot': img }, () => {
        });
        BluetoothService.turnCameraOff().then(() => {
          console.log("Camera OFF.");
        });
      });
    }, 5000);
  }

  onConnect = () => {
    BluetoothService.readCameraState().then((state) => {
      if (state == 0) {
        BluetoothService.turnCameraOn().then(() => {
          this.readCamera();
        })
      }
      else {
        this.readCamera();
      }
    });
  }

  onDisconnect = () => {
  }

  handleNotifications = () => {
  }

  onConnectClick = () => {
    BluetoothService.connect(this.setLoading, this.onConnect, this.onDisconnect, this.handleNotifications);
  }

  onDisconnectClick () {
  }

  render() {
    return (
      <div id='home'>
        <div>
          <button
            className="button-home"
            onClick={this.onConnectClick}
          >
            <div className="spinner">
              <div>Request Snapshot</div>
            </div>
          </button>
        </div>
        <div>
          <img src={this.state.snapshot}/>
        </div>
      </div>
    );
  }
}

export default App;
