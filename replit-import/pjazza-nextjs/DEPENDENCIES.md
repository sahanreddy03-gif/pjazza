# PJAZZA — Required Dependencies

## Core Framework

```bash
npx create-next-app@latest pjazza --typescript --tailwind --eslint --app --src-dir=false
```

## npm Packages

```bash
npm install lucide-react
```

## Full Package List

| Package        | Version  | Purpose                                |
|----------------|----------|----------------------------------------|
| `next`         | `14.x+`  | React framework (App Router)           |
| `react`        | `18.x+`  | UI library                             |
| `react-dom`    | `18.x+`  | React DOM renderer                     |
| `typescript`   | `5.x+`   | Type checking                          |
| `lucide-react` | `latest` | Icon library (all icons used in PJAZZA)|

## Google Fonts

Inter is loaded via CSS `@import` in `pjazza.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
```

No additional font configuration is needed in `next.config.js`.

## Icons Used (from lucide-react)

ArrowLeft, ArrowRight, Bell, Briefcase, Calculator, Calendar, Camera,
Car, ChefHat, CheckCircle, ChevronDown, ChevronRight, ChevronUp,
Clock, Code, Compass, Dumbbell, DollarSign, Eye, FileVideo, Film,
Flame, Globe, GraduationCap, Grid3X3, Heart, Home, Image, Info,
Landmark, Lightbulb, Lock, MapPin, MessageSquare, Mic, MicOff,
Minus, Music, Package, Palette, PawPrint, Phone, Play, Plus, Radio,
Scale, Scissors, Search, Send, Settings, Shield, Ship, ShoppingBag,
ShoppingCart, Smartphone, Star, Tag, Target, ThumbsUp, Trash2,
TrendingUp, Truck, Type, Upload, Users, Utensils, Video, VideoOff,
Waves, Wrench, X, Zap

## No Additional Dependencies Required

PJAZZA uses:
- Pure CSS (no Tailwind classes in components — all styling via inline styles + pjazza.css)
- Native browser APIs (IntersectionObserver for scroll animations)
- No state management libraries
- No data fetching libraries
- No animation libraries (all CSS animations)
