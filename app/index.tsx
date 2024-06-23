/* import { useState, useRef } from "react"; */
import { Image, ImageSourcePropType, View } from "react-native";
import Graphics from "./graphics";
import Navbar from "./navbar";
import { useEffect, useState } from "react";
import { COLORS } from "@/constants/backgrounds";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface BgColor {
  tipo: "color";
  valor: string;
}

interface BgImage {
  tipo: "imagen";
  valor: ImageSourcePropType;
}

export type BgType = BgColor | BgImage;

const App = () => {
  const [loaded, setLoaded] = useState(false);
  const [background, setBackground] = useState<BgType>({
    tipo: "color",
    valor: COLORS[0],
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
      <Navbar setBackground={setBackground} />
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
        {background.tipo === "imagen" && (
          <Image
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
            source={background.valor}
          />
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Graphics />
      </View>
    </View>
  );
};

export default App;
