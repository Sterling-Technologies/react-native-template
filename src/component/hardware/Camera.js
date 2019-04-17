import React, { Component } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform
} from 'react-native';
import {
  Ionicons,
  MaterialIcons,
  Foundation
} from '@expo/vector-icons';
import { Constants, Camera as ExpoCamera, ImagePicker, Permissions } from 'expo';

const landmarkSize = 2;

/**
 * Camera Settings
 */
const flashModeOrder = {
  off: 'on',
  on: 'auto',
  auto: 'torch',
  torch: 'off',
};

const flashIcons = {
  off: 'flash-off',
  on: 'flash-on',
  auto: 'flash-auto',
  torch: 'highlight'
};

const wbOrder = {
  auto: 'sunny',
  sunny: 'cloudy',
  cloudy: 'shadow',
  shadow: 'fluorescent',
  fluorescent: 'incandescent',
  incandescent: 'auto',
};

const wbIcons = {
  auto: 'wb-auto',
  sunny: 'wb-sunny',
  cloudy: 'wb-cloudy',
  shadow: 'beach-access',
  fluorescent: 'wb-iridescent',
  incandescent: 'wb-incandescent',
};

class Camera extends Component {
  constructor(props) {
    super(props);

    this.state = {
      flash: 'off',
      zoom: 0,
      autoFocus: 'on',
      type: 'front',
      whiteBalance: 'auto',
      ratio: '16:9',
      ratios: [],
      newPhotos: false,
      permissionsGranted: false,
      pictureSize: undefined,
      pictureSizes: [],
      pictureSizeId: 0,
      cameraRollPermission: false
    };

    // component methods
    this._collectPictureSizes = this._collectPictureSizes.bind(this);
    this._changePictureSize = this._changePictureSize.bind(this);
    this._getRatios = this._getRatios.bind(this);
    this._handleMountError = this._handleMountError.bind(this);
    this._nextPictureSize = this._nextPictureSize.bind(this);
    this._onPictureSaved = this._onPictureSaved.bind(this);
    this._pickImage = this._pickImage.bind(this);
    this._previousPictureSize = this._previousPictureSize.bind(this);
    this._renderBottomBar = this._renderBottomBar.bind(this);
    this._renderCamera = this._renderCamera.bind(this);
    this._renderNoPermissions = this._renderNoPermissions.bind(this);
    this._renderTopBar = this._renderTopBar.bind(this);
    this._requestCameraRollPermission = this._requestCameraRollPermission.bind(this);
    this._setFocusDepth = this._setFocusDepth.bind(this);
    this._setRatio = this._setRatio.bind(this);
    this._takePicture = this._takePicture.bind(this);
    this._toggleFacing = this._toggleFacing.bind(this);
    this._toggleFlash = this._toggleFlash.bind(this);
    this._toggleFocus = this._toggleFocus.bind(this);
    this._toggleWB = this._toggleWB.bind(this);
    this._toggleView = this._toggleView.bind(this);
    this._zoomOut = this._zoomOut.bind(this);
    this._zoomIn = this._zoomIn.bind(this);
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ permissionsGranted: status === 'granted' });
  }

  render() {
    const cameraScreenContent = this.state.permissionsGranted
      ? this._renderCamera()
      : this._renderNoPermissions();

    return (
      <View style={styles.container}>{cameraScreenContent}</View>
    );
  }

  /**
   * Fetches the available sizes of the images.
   */
  async _collectPictureSizes() {
    if (this.camera) {
      const pictureSizes = await this.camera.getAvailablePictureSizesAsync(this.state.ratio);

      let pictureSizeId = 0;

      if (Platform.OS === 'ios') {
        pictureSizeId = pictureSizes.indexOf('High');
      } else {
        // returned array is sorted in ascending order - default size is the largest one
        pictureSizeId = pictureSizes.length - 1;
      }

      this.setState({
        pictureSizes,
        pictureSizeId,
        pictureSize: pictureSizes[pictureSizeId]
      });
    }
  }

  /**
   * Changes the direction of the picture size.
   */
  _changePictureSize(direction) {
    let newId = this.state.pictureSizeId + direction;
    const length = this.state.pictureSizes.length;

    if (newId >= length) {
      newId = 0;
    } else if (newId < 0) {
      newId = length -1;
    }

    this.setState({
      pictureSize: this.state.pictureSizes[newId],
      pictureSizeId: newId
    });
  }

  /**
   * Fetches the ratios supported by the device camera.
   */
  async _getRatios() {
    const ratios = await this.camera.getSupportedRatios();
    return ratios;
  };

  /**
   * Handles when there's an error on loading the camera.
   */
  _handleMountError({ message }) {
    console.log(message);
  }

  /**
   * Selects the next size of the picture
   */
  _nextPictureSize() {
    this._changePictureSize(-1);
  }

  /**
   * Handles the captured image file.
   */
  _onPictureSaved(photo) {
    let uriParts = photo.uri.split('.');
    let fileType = uriParts[uriParts.length - 1];

    let value = {
      uri: photo.uri,
      type: 'image/' + fileType,
      name: 'image.' + fileType
    }

    this.setState({ newPhotos: true });
    this.props.onTakePhoto(this.props.field, value);

    this.props.onModalClose();
  }

  /**
   * Handles when an image is picked.
   */
  async _pickImage(key) {
    await this.requestCameraRollPermission();

    if (this.state.cameraRollPermission !== true) {
      return {};
    }

    let result = await ImagePicker.launchImageLibraryAsync();

    if (result.cancelled) {
      return {};
    }

    let uriParts = result.uri.split('.');
    let fileType = uriParts[uriParts.length - 1];

    let value = {
      uri: result.uri,
      type: 'image/' + fileType,
      name: 'image.' + fileType
    }

    this.props.onTakePhoto(key, value);
    this.props.onModalClose();

    return result;
  }

  /**
   * Selects the previous size of the picture
   */
  _previousPictureSize() {
    this._changePictureSize(1);
  }

  /**
   * Handles on rendering the bottom bar UI of the camera.
   */
  _renderBottomBar() {
    // state objects
    let {
      newPhotos
    } = this.state;

    return (
      <View
      style={styles.bottomBar}>
        <TouchableOpacity style={styles.bottomButton} onPress={this.props.onModalClose}>
          <Text style={styles.bottomButtonText}>Cancel</Text>
        </TouchableOpacity>

        <View style={{ flex: 0.4 }}>
          <TouchableOpacity
            onPress={this._takePicture}
            style={{ alignSelf: 'center' }}
          >
            <Ionicons name="ios-radio-button-on" size={70} color="white" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.bottomButton}
          onPress={ async () => {
            await this._pickImage(this.props.field)
          }}>
          <View>
            <Foundation name="thumbnails" size={30} color="white" />
            {newPhotos && <View style={styles.newPhotosDot}/>}
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  /**
   * Renders the camera UI.
   */
  _renderCamera() {
    // state objects
    let {
      autoFocus,
      flash,
      pictureSize,
      ratio,
      type,
      whiteBalance,
      zoom
    } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <ExpoCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.camera}
          onCameraReady={this._collectPictureSizes}
          type={type}
          flashMode={flash}
          autoFocus={autoFocus}
          zoom={zoom}
          whiteBalance={whiteBalance}
          ratio={ratio}
          pictureSize={pictureSize}
          onMountError={this._handleMountError}
          >
          {this._renderTopBar()}
          {this._renderBottomBar()}
        </ExpoCamera>
      </View>
    );
  }

  /**
   * Renders the template if the application does not have access to the camera.
   */
  _renderNoPermissions() {
    return (
      <View style={styles.noPermissions}>
        <Text style={{ color: 'white' }}>
          Camera permissions not granted - cannot open camera preview.
        </Text>
      </View>
    );
  }

  /**
   * Renders the top bar of the camera UI.
   */
  _renderTopBar() {
    return (
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.toggleButton} onPress={this._toggleFacing}>
          <Ionicons name="ios-reverse-camera" size={32} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.toggleButton} onPress={this._toggleFlash}>
          <MaterialIcons name={flashIcons[this.state.flash]} size={32} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.toggleButton} onPress={this._toggleWB}>
          <MaterialIcons name={wbIcons[this.state.whiteBalance]} size={32} color="white" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.toggleButton} onPress={this._toggleFocus}>
          <Text style={[styles.autoFocusLabel, { color: this.state.autoFocus === 'on' ? "white" : "#6b6b6b" }]}>AF</Text>
        </TouchableOpacity>
    </View>
    );
  }

  /**
   * Checks and requests if the app can access the camera.
   */
  async _requestCameraRollPermission() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

    // check the status
    if (status === 'granted') {
      this.setState({ cameraRollPermission: true });
    } else {
      // not granted.
      this.setState({ cameraRollPermission: false }, () => {
        Alert.alert(
          'Yikes!',
          'Please enable Monico to access your photo library from your device settings.'
        );
      });
    }
  }

  /**
   * Sets the camera focus depth of the image.
   */
  _setFocusDepth(depth) {
    this.setState({ depth });
  }

  /**
   * Sets the ration of the image.
   */
  _setRatio(ratio) {
    this.setState({ ratio });
  }

  /**
   * Takes the picture.
   */
  _takePicture() {
    if (this.camera) {
      this.camera.takePictureAsync({ onPictureSaved: this._onPictureSaved });
    }
  }

  /**
   * Toggles which camera to use.
   */
  _toggleFacing() {
    this.setState({
      type: this.state.type === 'back' ? 'front' : 'back'
    });
  }

  /**
   * Toggles the camera flash options.
   */
  _toggleFlash() {
    this.setState({
      flash: flashModeOrder[this.state.flash]
    });
  }

  /**
   * Toggles to let the camera focus.
   */
  _toggleFocus() {
    this.setState({
      autoFocus: this.state.autoFocus === 'on' ? 'off' : 'on'
    });
  }

  /**
   * Toggles the white balance option.
   */
  _toggleWB() {
    this.setState({ whiteBalance: wbOrder[this.state.whiteBalance] });
  }

  /**
   * Toggles to show the camera gallery or camera.
   */
  _toggleView() {
    this.setState({
      showGallery: !this.state.showGallery,
      newPhotos: false
    });
  }

  /**
   * Zooms out the view of the camera.
   */
  _zoomOut() {
    this.setState({
      zoom: this.state.zoom - 0.1 < 0 ? 0 : this.state.zoom - 0.1
    });
  }

  /**
   * Zooms in the view of the camera.
   */
  _zoomIn() {
    this.setState({
      zoom: this.state.zoom + 0.1 > 1 ? 1 : this.state.zoom + 0.1
    });
  }
}

/**
 * Style Components
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    flex: 0.2,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Constants.statusBarHeight / 2,
  },
  bottomBar: {
    paddingBottom: /*isIPhoneX ? 25 : */5,
    backgroundColor: 'transparent',
    alignSelf: 'flex-end',
    justifyContent: 'space-between',
    flex: 0.12,
    flexDirection: 'row',
  },
  noPermissions: {
    flex: 1,
    alignItems:'center',
    justifyContent: 'center',
    padding: 10,
  },
  gallery: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  toggleButton: {
    flex: 0.25,
    height: 40,
    marginHorizontal: 2,
    marginBottom: 10,
    marginTop: 20,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoFocusLabel: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  bottomButton: {
    flex: 0.3,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomButtonText: {
    fontSize: 20,
    color: '#FFF'
  },
  newPhotosDot: {
    position: 'absolute',
    top: 0,
    right: -5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4630EB'
  },
  options: {
    position: 'absolute',
    bottom: 80,
    left: 30,
    width: 200,
    height: 80,
    backgroundColor: '#000000BA',
    borderRadius: 4,
    padding: 10,
  },
  detectors: {
    flex: 0.5,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  pictureQualityLabel: {
    fontSize: 10,
    marginVertical: 3,
    color: 'white'
  },
  pictureSizeContainer: {
    flex: 0.5,
    alignItems: 'center',
    paddingTop: 10,
  },
  pictureSizeChooser: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  pictureSizeLabel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  facesContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
  },
  face: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: 'absolute',
    borderColor: '#FFD700',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  landmark: {
    width: landmarkSize,
    height: landmarkSize,
    position: 'absolute',
    backgroundColor: 'red',
  },
  faceText: {
    color: '#FFD700',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    backgroundColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
  },
});

export default Camera;
