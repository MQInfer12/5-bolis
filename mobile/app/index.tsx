/* import { useState, useRef } from "react"; */
import {
  Image,
  ImageSourcePropType,
  StatusBar,
  Text,
  View,
} from "react-native";
import Graphics from "./graphics";
import Navbar from "./navbar";
import { useEffect, useState } from "react";
import { COLORS } from "@/constants/backgrounds";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CameraView, useCameraPermissions } from "expo-camera";

interface BgColor {
  tipo: "color";
  valor: string;
}

interface BgImage {
  tipo: "imagen";
  valor: ImageSourcePropType;
}

interface BgGalery {
  tipo: "galeria";
  valor: string;
}

interface BgCamera {
  tipo: "camara";
}

export type BgType = BgColor | BgImage | BgGalery | BgCamera;

const App = () => {
  const [loaded, setLoaded] = useState(false);
  const [background, setBackground] = useState<BgType>({
    tipo: "color",
    valor: COLORS[0],
  });
  const [permission, requestPermission] = useCameraPermissions({
    request: false,
    get: true,
  });

  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem("background", JSON.stringify(background));
    }
  }, [background]);

  useEffect(() => {
    const loadBackground = async () => {
      const storage = await AsyncStorage.getItem("background");
      if (storage) {
        const background = JSON.parse(storage);
        setBackground(background);
      }
      setLoaded(true);
    };
    if (!loaded) {
      loadBackground();
    }
  }, []);

  if (!loaded) return null;
  return (
    <View /* key={counter} */ style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      <Navbar
        cameraPermission={permission}
        requestCameraPermission={requestPermission}
        setBackground={setBackground}
      />
      <View
        style={{
          position: "absolute",
          top: 0,
          width: "100%",
          height: "100%",
          left: 0,
          zIndex: -1,
          backgroundColor:
            background.tipo === "color" ? background.valor : "#ffffff",
        }}
      >
        {(background.tipo === "imagen" || background.tipo === "galeria") && (
          <Image
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            source={
              background.tipo === "imagen"
                ? background.valor
                : { uri: background.valor }
            }
          />
        )}
        {background.tipo === "camara" &&
          (permission?.granted ? (
            <CameraView
              facing="back"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          ) : (
            <View
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#000000",
                justifyContent: "flex-end",
                alignItems: "center",
                paddingBottom: 80,
              }}
            >
              <Text style={{ color: "#FFFFFF" }}>
                Otorga permisos para acceder a la cámara
              </Text>
            </View>
          ))}
      </View>
      <View style={{ flex: 1 }}>
        <Graphics />
      </View>
    </View>
  );
};

export default App;
