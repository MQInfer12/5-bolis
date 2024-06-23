import { ExpoWebGLRenderingContext, GLView } from "expo-gl";
import React, { useRef } from "react";
import { TouchableOpacity } from "react-native";
import * as THREE from "three";
import { Renderer, TextureLoader } from "expo-three";

const Graphics = () => {
  const coinRef = useRef<any>(null);
  const velocityRef = useRef(new THREE.Vector3());
  const rotationVelocityRef = useRef(new THREE.Vector3());
  const onAir = useRef(false);

  const onGLContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      60,
      gl.drawingBufferWidth / gl.drawingBufferHeight,
      0.1,
      1000
    );
    camera.position.set(-8, 8, 0);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const renderer = new Renderer({ gl });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 0.5);
    spotLight.position.set(-1, 1.5, 1.5);
    scene.add(spotLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // Cargar texturas
    const textureLoader = new TextureLoader();
    const textureTop = textureLoader.load(require("../assets/top.png"));
    const materialTop = new THREE.MeshStandardMaterial({
      map: textureTop,
      side: THREE.DoubleSide,
    });

    const textureBottom = textureLoader.load(require("../assets/bottom.png"));
    const materialBottom = new THREE.MeshStandardMaterial({
      map: textureBottom,
      side: THREE.DoubleSide,
    });

    const materialSide = new THREE.MeshStandardMaterial({ color: "lightgray" });

    const geometry = new THREE.CylinderGeometry(1, 1, 0.1, 64);
    const materials = [materialSide, materialTop, materialBottom];
    const coin = new THREE.Mesh(geometry, materials);
    coinRef.current = coin;
    scene.add(coin);

    coin.position.set(-2, 0, 0);

    const animate = () => {
      requestAnimationFrame(animate);

      if (coinRef.current) {
        coinRef.current.position.add(velocityRef.current);
        coinRef.current.rotation.x += rotationVelocityRef.current.x;
        coinRef.current.rotation.y += rotationVelocityRef.current.y;
        coinRef.current.rotation.z += rotationVelocityRef.current.z;

        velocityRef.current.y -= 0.01;

        if (coinRef.current.position.y <= 0) {
          coinRef.current.position.y = 0;
          velocityRef.current.set(0, 0, 0);

          rotationVelocityRef.current.multiplyScalar(0.9);
          if (rotationVelocityRef.current.length() < 0.01) {
            rotationVelocityRef.current.set(0, 0, 0);

            const xMod = coinRef.current.rotation.x % (Math.PI * 2);

            if (xMod > Math.PI / 2 && xMod < 1.5 * Math.PI) {
              // Cara
              coinRef.current.rotation.x = THREE.MathUtils.lerp(
                coinRef.current.rotation.x,
                Math.PI,
                0.1
              );
            } else {
              // Escudo
              coinRef.current.rotation.x = THREE.MathUtils.lerp(
                coinRef.current.rotation.x,
                0,
                0.1
              );
            }

            coinRef.current.rotation.y = THREE.MathUtils.lerp(
              coinRef.current.rotation.y,
              0,
              0.1
            );
            coinRef.current.rotation.z = THREE.MathUtils.lerp(
              coinRef.current.rotation.z,
              0,
              0.1
            );

            onAir.current = false;
          }
        }
      }

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    animate();
  };

  const handlePress = () => {
    if (!onAir.current) {
      onAir.current = true;
      velocityRef.current.set(0, 0.3, 0);
      rotationVelocityRef.current.set(
        (Math.random() - 0.5) * 0.25,
        (Math.random() - 0.5) * 0.25,
        (Math.random() - 0.5) * 0.25
      );
    }
  };

  return (
    <>
      <TouchableOpacity style={{ flex: 1 }} onPress={handlePress}>
        <GLView style={{ flex: 1 }} onContextCreate={onGLContextCreate} />
      </TouchableOpacity>
    </>
  );
};

export default Graphics;
