
class BluetoothService {

	constructor() {
		this.bleNusServiceUUID  = '00001523-1212-efde-1523-785feabcd123';
		this.bleNusLightUUID    = '00001525-1212-efde-1523-785feabcd123';

		this.connected = false;
		this.bleDevice = undefined;
		this.nusService = undefined;
		this.lightCharacteristic = undefined;
	}

	connect(setLoading, onConnected, onDisconnected, onMessage) {
		if (!navigator.bluetooth) {
			console.log('WebBluetooth API is not available.\r\n' +
						'Please make sure the Web Bluetooth flag is enabled.');
			return;
		}
		console.log('Requesting Bluetooth Device...');
		navigator.bluetooth.requestDevice({
			filters: [{services: [this.bleNusServiceUUID]}],
			// filters: [{namePrefix: 'Maia'}],
			optionalServices: [this.bleNusServiceUUID]
			// acceptAllDevices: true
		})
		.then(device => {
			setLoading(true);
			this.bleDevice = device;
			console.log('Found ' + device.name);
			console.log('Connecting to GATT Server...');
			this.bleDevice.addEventListener('gattserverdisconnected', this.onDisconnected);
			return device.gatt.connect();
		})
		.then(server => {
			console.log('Locate NUS service');
			return server.getPrimaryService(this.bleNusServiceUUID);
		}).then(service => {
			this.nusService = service;
			console.log('Found NUS service: ' + service.uuid);
		})
		.then(() => {
			console.log('Locate Light characteristic');
			return this.nusService.getCharacteristic(this.bleNusLightUUID);
		})
		.then(characteristic => {
			this.lightCharacteristic = characteristic;
			console.log('Found RX characteristic');
		})
		.then(() => {
			console.log(this.bleDevice.name + ' Connected.');
			this.connected = true;
			this.onConnected();
		})
		.catch(error => {
			console.error('' + error);
			//window.term_.io.println('' + error);
			if(this.bleDevice && this.bleDevice.gatt.connected)
			{
				this.bleDevice.gatt.disconnect();
			}
		});

		this.onConnectedCallback = onConnected;
		this.onDisconnectedCallback = onDisconnected;
		this.onMessageCallback = onMessage;
	}

	readCameraState = () => {
		let p = new Promise((resolve, reject) => {
			this.lightCharacteristic.readValue()
			.then((value) => {
				resolve(value.getUint8(0));
			})
			.catch((error) => {
				reject(error);
			});
		});
		return p;
	}

	turnCameraOn = () => {
		return this.lightCharacteristic.writeValue(Uint8Array.of(1));
	}

	turnCameraOff = () => {
		return this.lightCharacteristic.writeValue(Uint8Array.of(0));
	}

	handleNotifications = (event) => {
		let buffer = event.target.value.buffer;
	   	this.stream.receive(buffer);
	}

	disconnect() {
		if (this.bleDevice.gatt) {
			this.bleDevice.gatt.disconnect();
		}
	}

	onConnected = () => {
		if (this.onConnectedCallback) {
			this.onConnectedCallback();
		}
	}

	onDisconnected = () => {
		if (this.onDisconnectedCallback) {
			this.onDisconnectedCallback();
		}
	}

	onSocketMessage = (event) => {
	    event.data.arrayBuffer().then(buffer => {
	    	this.stream.receive(buffer);
	    });
	}

	onMessage = (buffer) => {
		console.log(buffer);
	}

	sendMessage(message) {
		console.log(message);
	}

}

const BluetoothServiceInstance = new BluetoothService();
export default BluetoothServiceInstance;