/**
 * index.js — Point d'entrée racine de l'application
 *
 * Ce fichier est le VRAI premier fichier exécuté par Metro/Expo.
 *
 * Ordre OBLIGATOIRE :
 * 1. Notre polyfill expo-crypto (remplace react-native-get-random-values)
 * 2. expo-router/entry
 *
 * NE PAS importer react-native-get-random-values ici —
 * il ne supporte pas la New Architecture (RN 0.71+ / Expo SDK 50+).
 */

// ⚠️ PREMIER IMPORT ABSOLU — polyfill crypto.getRandomValues
import './src/lib/crypto/polyfill';

// Point d'entrée Expo Router
import 'expo-router/entry';
