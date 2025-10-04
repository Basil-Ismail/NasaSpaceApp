# Textures for 3D Models

Place your texture images here for enhanced visual quality.

## Required Textures

### Earth Texture

- **Filename**: `earth_daymap.jpg`
- **Source**: https://visibleearth.nasa.gov/
- **Resolution**: 2048x1024 or higher
- **Format**: JPG or PNG

### Asteroid/Meteor Texture

- **Filename**: `asteroid.jpg`
- **Source**: NASA's asteroid texture repository or Solar System Scope
- **Resolution**: 1024x1024 or higher
- **Format**: JPG or PNG
- **Description**: Rocky, cratered surface texture

## Where to Get Textures

1. **NASA's Visible Earth**: https://visibleearth.nasa.gov/
   - High-quality Earth textures
   - Free for public use

2. **Solar System Scope**: https://www.solarsystemscope.com/textures/
   - Complete set of planetary textures
   - Includes asteroid/moon textures

3. **Free Alternatives**:
   - Search for "Earth texture 4K"
   - Search for "asteroid texture" or "moon texture"
   - Use any rocky/cratered surface image

## Optional Enhanced Textures

- `earth_normal.jpg` - Normal/bump map for Earth
- `earth_specular.jpg` - Specular/gloss map for Earth
- `asteroid_normal.jpg` - Normal map for asteroids

These will be automatically loaded if present but are not required.

## Fallback Behavior

If textures are not found:

- **Earth**: Blue procedural sphere
- **Asteroids**: Gray dodecahedron with color tinting

The app works fine without textures, they just enhance visual quality!
