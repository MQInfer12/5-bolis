import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { BgType } from ".";
import { SetState } from "@/types/setState";
import { COLORS, IMAGES } from "@/constants/backgrounds";
import * as ImagePicker from "expo-image-picker";
import { PermissionResponse } from "expo-camera";

interface Props {
  cameraPermission: PermissionResponse | null;
  requestCameraPermission: () => Promise<PermissionResponse>;
  setBackground: SetState<BgType>;
}

const Navbar = ({
  cameraPermission,
  requestCameraPermission,
  setBackground,
}: Props) => {
  const [active, setActive] = useState(false);

  const pickCamera = async () => {
    let granted = !!cameraPermission?.granted;
    if (!granted) {
      await requestCameraPermission();
    }
    setBackground({
      tipo: "camara",
    });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setBackground({
        tipo: "galeria",
        valor: result.assets[0].uri,
      });
    }
  };

  return (
    <View
      style={{
        position: "absolute",
        flexDirection: "row",
        top: 0,
        right: 0,
        zIndex: 10,
        padding: 10,
        gap: 10,
      }}
    >
      {active && (
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            borderRadius: 8,
            borderWidth: 2,
            borderColor: "#78716c",
            paddingVertical: 8,
            paddingHorizontal: 12,
          }}
        >
          <ScrollView contentContainerStyle={{ gap: 8 }}>
            <Text
              style={{
                fontWeight: 900,
                color: "rgba(0, 0, 0, 0.6)",
                fontSize: 18,
              }}
            >
              Color plano
            </Text>
            <ScrollView
              contentContainerStyle={{
                flexDirection: "row",
                gap: 8,
                paddingBottom: 8,
              }}
              horizontal
            >
              {COLORS.map((color, i) => (
                <TouchableOpacity
                  key={i}
                  style={{
                    height: 48,
                    aspectRatio: 1,
                    backgroundColor: color,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#78716c",
                  }}
                  onPress={() => {
                    setBackground({
                      tipo: "color",
                      valor: color,
                    });
                  }}
                />
              ))}
            </ScrollView>
            <Text
              style={{
                fontWeight: 900,
                color: "rgba(0, 0, 0, 0.6)",
                fontSize: 18,
              }}
            >
              Imágenes
            </Text>
            <ScrollView
              contentContainerStyle={{
                flexDirection: "row",
                gap: 8,
                paddingBottom: 8,
              }}
              horizontal
            >
              {IMAGES.map((image, i) => (
                <TouchableOpacity
                  key={i}
                  style={{
                    width: 48,
                    alignItems: "center",
                    gap: 2,
                  }}
                  onPress={() => {
                    setBackground({
                      tipo: "imagen",
                      valor: image.src,
                    });
                  }}
                >
                  <View
                    style={{
                      height: 48,
                      aspectRatio: 1,
                      backgroundColor: "#ffffff",
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: "#78716c",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      source={image.src}
                    />
                  </View>
                  <Text
                    style={{ fontSize: 12, color: "rgba(0,0,0,0.7)" }}
                    numberOfLines={1}
                  >
                    {image.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text
              style={{
                fontWeight: 900,
                color: "rgba(0, 0, 0, 0.6)",
                fontSize: 18,
              }}
            >
              Personalizado
            </Text>
            <ScrollView
              contentContainerStyle={{
                flexDirection: "row",
                gap: 8,
                paddingBottom: 8,
              }}
              horizontal
            >
              <TouchableOpacity
                style={{
                  width: 48,
                  alignItems: "center",
                  gap: 2,
                }}
                onPress={pickImage}
              >
                <View
                  style={{
                    height: 48,
                    aspectRatio: 1,
                    backgroundColor: "#ffffff",
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#78716c",
                    overflow: "hidden",
                    padding: 4,
                  }}
                >
                  <Image
                    style={{ width: "100%", height: "100%" }}
                    source={require("../assets/svgs/photo-plus.png")}
                  />
                </View>
                <Text
                  style={{ fontSize: 12, color: "rgba(0,0,0,0.7)" }}
                  numberOfLines={1}
                >
                  Galería
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: 48,
                  alignItems: "center",
                  gap: 2,
                }}
                onPress={pickCamera}
              >
                <View
                  style={{
                    height: 48,
                    aspectRatio: 1,
                    backgroundColor: "#ffffff",
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: "#78716c",
                    overflow: "hidden",
                    padding: 4,
                  }}
                >
                  <Image
                    style={{ width: "100%", height: "100%" }}
                    source={require("../assets/svgs/camera.png")}
                  />
                </View>
                <Text
                  style={{ fontSize: 12, color: "rgba(0,0,0,0.7)" }}
                  numberOfLines={1}
                >
                  Cámara
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </ScrollView>
        </View>
      )}
      <TouchableOpacity
        style={{
          aspectRatio: 1,
          width: 48,
          backgroundColor: "#78716c",
          borderRadius: 8,
          padding: 4,
        }}
        onPress={() => setActive((prev) => !prev)}
      >
        <Image
          style={{ width: "100%", height: "100%" }}
          source={require("../assets/svgs/dots.png")}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Navbar;
