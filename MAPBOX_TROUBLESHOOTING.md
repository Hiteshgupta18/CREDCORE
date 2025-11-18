# Mapbox Map Troubleshooting Guide

## Quick Test
Visit **http://localhost:3000/map-test** to see debug information in the browser console.

## Common Issues & Solutions

### 1. Map Not Displaying (Blank/Gray Screen)

**Possible Causes:**
- Invalid or missing Mapbox token
- Token not properly loaded from .env
- CORS or network issues
- CSS not properly loaded

**Solutions:**

#### Check Token in Browser Console
1. Open Developer Tools (F12 or Cmd+Option+I)
2. Go to Console tab
3. Look for "MAPBOX DEBUG INFO" logs
4. Verify token starts with `pk.` and has correct length

#### Verify .env File
Your `.env` file should have:
```env
REACT_APP_MAPBOX_TOKEN=pk.eyJ1IjoiZ2F1dGFtamkiLCJhIjoiY21oZTM2dnJ4MDg1NDJscXl1YXJvMnd1NSJ9._jTb5haeAFDzD0XXgH6dnQ
```

**Important:** 
- No quotes around the token
- No spaces before/after the `=`
- Token must start with `pk.`

#### Restart React Server
After modifying `.env`, you MUST restart:
```bash
# Kill React server
pkill -f react-scripts

# Start fresh
npm start
```

### 2. Network/CORS Errors

**Check Browser Console for:**
- 401 Unauthorized errors → Invalid token
- 403 Forbidden → Token doesn't have permissions
- Network errors → Internet connection issue

**Solution:**
1. Verify internet connection
2. Check if token is active at https://account.mapbox.com/
3. Ensure token has all scopes enabled

### 3. Token Validation

**Verify your token works:**
```bash
curl "https://api.mapbox.com/geocoding/v5/mapbox.places/jaipur.json?access_token=YOUR_TOKEN"
```

Replace `YOUR_TOKEN` with your actual token. Should return JSON data.

### 4. CSS Not Loading

**Symptoms:** Map renders but controls/markers look broken

**Solution:**
The CSS is imported in multiple places for redundancy:
- `src/index.js` - Global import
- `src/components/HospitalMap.js` - Component level
- `src/style.css` - Via @import

Try clearing browser cache (Cmd+Shift+R or Ctrl+Shift+R)

### 5. React Strict Mode Issues

If you see duplicate console logs, it's normal (React 18 Strict Mode).
The map should still work correctly.

## Debug Checklist

- [ ] Token exists in `.env` file
- [ ] Token starts with `pk.`
- [ ] React server restarted after editing `.env`
- [ ] Browser console shows no errors
- [ ] Internet connection working
- [ ] Visited `/map-test` page to see debug info
- [ ] Browser cache cleared

## Testing Steps

1. **Test Basic Map** - Visit `/map-test`
   - Should see Jaipur map with green marker
   - Console should show "Map loaded successfully!"

2. **Test Hospital Validation** - Visit `/validation`
   - Upload hospital document
   - Map should appear below with markers
   - Click markers to see popups

3. **Check Console Logs**
   ```
   Expected logs:
   ✓ Mapbox Token: Token loaded ✓
   ✓ Token length: 169
   ✓ Initializing Mapbox map...
   ✓ Map loaded successfully ✓
   ```

## Still Not Working?

### Verify Token Permissions
1. Go to https://account.mapbox.com/
2. Click on your token
3. Ensure these scopes are enabled:
   - styles:tiles
   - styles:read
   - fonts:read
   - datasets:read

### Create New Token
1. Go to https://account.mapbox.com/access-tokens/
2. Click "Create a token"
3. Give it a name (e.g., "CrediCore Development")
4. Enable all public scopes
5. Copy the new token
6. Update `.env` file
7. Restart React server

### Check Browser Support
Mapbox requires:
- WebGL support
- Modern browser (Chrome, Firefox, Safari, Edge)

Test WebGL: Visit https://get.webgl.org/

## Error Messages Reference

| Error | Meaning | Solution |
|-------|---------|----------|
| "Token missing" | REACT_APP_MAPBOX_TOKEN not in .env | Add token to .env and restart |
| "401 Unauthorized" | Invalid token | Verify token is correct |
| "403 Forbidden" | Token lacks permissions | Check token scopes |
| "Style not found" | Invalid map style | Using default `streets-v12` style |
| "Failed to fetch" | Network/CORS issue | Check internet connection |

## Contact Support

If map still doesn't work after trying all solutions:
1. Check browser console for specific error messages
2. Share the error with Mapbox support
3. Verify token at: https://account.mapbox.com/

## Testing Your Token

Run this in browser console on `/map-test` page:
```javascript
fetch(`https://api.mapbox.com/styles/v1/mapbox/streets-v12?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`)
  .then(r => r.json())
  .then(d => console.log('Token valid!', d))
  .catch(e => console.error('Token invalid!', e));
```

Should print "Token valid!" if everything works.
