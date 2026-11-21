import{j as f,a as xe,r as C,L as Yt}from"./react-vendor-i2Ccrb7u.js";import{c as ia,C as Bt,am as Xt,R as Y,bn as Ht,d as Sa,bK as Gt,bL as Vt,aq as qt,bM as Kt,bh as Oa,bN as _e,a2 as Jt}from"./index-0FzjuGcD.js";import{a as Qt,B as M,T as O,u as ba,P as Aa,a1 as Zt,f as L,_ as ar,$ as er,a4 as Se,a5 as nr,a0 as we,b as B,h as K,m as Ua,I as Ya,af as tr,Y as J,U as wa,aq as rr,ar as ir,as as or,at as Te,au as T,a8 as Ne,av as sr,g as lr,K as fr,X as cr,w as bn,x as yn,y as xn,H as Sn}from"./mui-vendor-BabvZBR7.js";import{S as ur}from"./Search-DBqDiaqt.js";import{R as dr}from"./RestartAlt-BXxuI7X9.js";import{D as wn}from"./DeleteOutline-MICkSyM2.js";import{P as mr}from"./PersonSearchOutlined-B9XQ0faM.js";import{A as gr}from"./AdminPanelSettings-CysefSDp.js";import pr from"./EditUserData-2Hw1u5bO.js";import"./formik.esm-B5Uqyvlj.js";import"./index.esm-DAYaGubV.js";import"./EditOutlined-D8oXLlmK.js";import"./PersonOutline-CUspt5gw.js";import"./PhoneOutlined-IYbIG40o.js";import"./EmailOutlined-CkKP7OXq.js";import"./LocationOnOutlined-CRch99yP.js";import"./ImageOutlined-CQE1Yqpi.js";import"./useAddressData-B1mcAHfQ.js";import"./cities-BdLxJw2d.js";const hr=Qt(f.jsx("path",{d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2M4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12m8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8"})),vr=({totalUsers:a})=>{const{t:e}=ia();return f.jsxs(M,{sx:{display:"flex",alignItems:"baseline",justifyContent:"space-between",gap:2,flexWrap:"wrap"},children:[f.jsxs(M,{children:[f.jsx(O,{component:"h1",variant:"h4",fontWeight:800,letterSpacing:-.5,children:e("pages.usersManagement.title")}),f.jsx(O,{color:"text.secondary",sx:{mt:.5},children:e("pages.usersManagement.subtitle")})]}),f.jsxs(O,{variant:"body2",color:"text.secondary",children:[a," ",e("pages.usersManagement.stats.total")]})]})},br=({stats:a,active:e,onSelect:n})=>{const t=ba(),{t:r}=ia(),o=[{key:"total",label:r("pages.usersManagement.stats.total"),value:a.total,color:t.palette.primary.main},{key:"active",label:r("pages.usersManagement.stats.active"),value:a.active,color:t.palette.success.main},{key:"inactive",label:r("pages.usersManagement.stats.inactive"),value:a.inactive,color:t.palette.error.main},{key:"admins",label:r("pages.usersManagement.stats.admins"),value:a.admins,color:t.palette.warning.main}];return f.jsx(Aa,{elevation:0,sx:{p:.5,borderRadius:3,border:`1px solid ${t.palette.divider}`,display:"grid",gridTemplateColumns:{xs:"repeat(2, 1fr)",md:"repeat(4, 1fr)"},gap:.5},children:o.map(i=>{const s=e===i.key;return f.jsxs(Zt,{onClick:()=>n(i.key),"aria-pressed":s,sx:{borderRadius:2.5,px:2.5,py:1.75,display:"flex",flexDirection:"column",alignItems:"flex-start",textAlign:"start",gap:.25,bgcolor:s?L(i.color,.1):"transparent",transition:"background-color 0.15s ease","&:hover":{bgcolor:L(i.color,s?.14:.06)},"&.Mui-focusVisible":{outline:`2px solid ${i.color}`}},children:[f.jsxs(M,{sx:{display:"flex",alignItems:"center",gap:1},children:[f.jsx(M,{sx:{width:8,height:8,borderRadius:"50%",bgcolor:i.color}}),f.jsx(O,{variant:"body2",color:"text.secondary",children:i.label})]}),f.jsx(O,{variant:"h4",fontWeight:800,sx:{fontVariantNumeric:"tabular-nums"},children:i.value})]},i.key)})})},yr=({search:a,status:e,role:n,onSearch:t,onRoleChange:r,onReset:o})=>{const{t:i}=ia(),s=!!a||e!=="all"||n!=="all";return f.jsxs(M,{sx:{display:"flex",gap:1.5,flexWrap:"wrap",alignItems:"center"},children:[f.jsx(ar,{size:"small",value:a,onChange:l=>t(l.target.value),placeholder:i("pages.usersManagement.filters.search"),sx:{flex:1,minWidth:240,"& .MuiOutlinedInput-root":{borderRadius:2.5,bgcolor:"background.paper"}},slotProps:{input:{startAdornment:f.jsx(er,{position:"start",children:f.jsx(ur,{sx:{color:"text.secondary"}})})}}}),f.jsxs(Se,{size:"small",sx:{minWidth:170},children:[f.jsx(nr,{children:i("pages.usersManagement.filters.role")}),f.jsxs(we,{value:n,label:i("pages.usersManagement.filters.role"),onChange:l=>r(l.target.value),sx:{borderRadius:2.5,bgcolor:"background.paper"},children:[f.jsx(B,{value:"all",children:i("pages.usersManagement.roles.all")}),f.jsx(B,{value:"Admin",children:i("pages.usersManagement.roles.admin")}),f.jsx(B,{value:"Moderator",children:i("pages.usersManagement.roles.moderator")}),f.jsx(B,{value:"Client",children:i("pages.usersManagement.roles.client")})]})]}),s&&f.jsx(K,{color:"inherit",onClick:o,startIcon:f.jsx(dr,{}),sx:{borderRadius:2.5,whiteSpace:"nowrap"},children:i("pages.usersManagement.filters.reset")})]})},xr=({selectedCount:a,selectedRole:e,onRoleChange:n,onBulkRoleUpdate:t,onActivate:r,onDeactivate:o,onDelete:i,onClear:s,t:l,direction:c})=>{const m=ba();return a===0?null:f.jsxs(Aa,{dir:c,elevation:8,sx:{position:"fixed",bottom:{xs:12,md:24},left:"50%",transform:"translateX(-50%)",zIndex:m.zIndex.modal-1,width:"max-content",maxWidth:"calc(100vw - 24px)",px:2,py:1.25,borderRadius:4,border:`1px solid ${m.palette.divider}`,display:"flex",alignItems:"center",justifyContent:"center",gap:1.5,flexWrap:"wrap"},children:[f.jsxs(M,{sx:{display:"flex",alignItems:"center",gap:.5},children:[f.jsx(Ua,{title:l("pages.usersManagement.bulk.clear"),children:f.jsx(Ya,{size:"small",onClick:s,children:f.jsx(Bt,{fontSize:"small"})})}),f.jsxs(O,{fontWeight:800,noWrap:!0,children:[a," ",l("pages.usersManagement.bulk.selected")]})]}),f.jsxs(M,{sx:{display:"flex",gap:1},children:[f.jsx(K,{size:"small",color:"success",startIcon:f.jsx(Xt,{}),onClick:r,sx:{borderRadius:2,fontWeight:700},children:l("pages.usersManagement.bulk.activate")}),f.jsx(K,{size:"small",color:"warning",startIcon:f.jsx(hr,{}),onClick:o,sx:{borderRadius:2,fontWeight:700},children:l("pages.usersManagement.bulk.deactivate")})]}),f.jsxs(M,{sx:{display:"flex",gap:1,alignItems:"center"},children:[f.jsx(Se,{size:"small",sx:{minWidth:140},children:f.jsxs(we,{displayEmpty:!0,value:e,onChange:u=>n(u.target.value),sx:{borderRadius:2},children:[f.jsx(B,{value:"",children:l("pages.usersManagement.bulk.selectRole")}),f.jsx(B,{value:Y.Admin,children:l("pages.usersManagement.roles.admin")}),f.jsx(B,{value:Y.Moderator,children:l("pages.usersManagement.roles.moderator")}),f.jsx(B,{value:Y.Client,children:l("pages.usersManagement.roles.client")})]})}),f.jsx(K,{size:"small",variant:"contained",disableElevation:!0,disabled:!e,onClick:t,sx:{borderRadius:2,fontWeight:700},children:l("pages.usersManagement.bulk.updateRole")})]}),f.jsx(K,{size:"small",color:"error",startIcon:f.jsx(wn,{}),onClick:i,sx:{borderRadius:2,fontWeight:700},children:l("pages.usersManagement.bulk.delete")})]})};/*!
 * Font Awesome Free 7.3.1 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 * Copyright 2026 Fonticons, Inc.
 */function ie(a,e){(e==null||e>a.length)&&(e=a.length);for(var n=0,t=Array(e);n<e;n++)t[n]=a[n];return t}function Sr(a){if(Array.isArray(a))return a}function wr(a){if(Array.isArray(a))return ie(a)}function kr(a,e){if(!(a instanceof e))throw new TypeError("Cannot call a class as a function")}function Ar(a,e){for(var n=0;n<e.length;n++){var t=e[n];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(a,kn(t.key),t)}}function jr(a,e,n){return e&&Ar(a.prototype,e),Object.defineProperty(a,"prototype",{writable:!1}),a}function $a(a,e){var n=typeof Symbol<"u"&&a[Symbol.iterator]||a["@@iterator"];if(!n){if(Array.isArray(a)||(n=ke(a))||e){n&&(a=n);var t=0,r=function(){};return{s:r,n:function(){return t>=a.length?{done:!0}:{done:!1,value:a[t++]}},e:function(l){throw l},f:r}}throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var o,i=!0,s=!1;return{s:function(){n=n.call(a)},n:function(){var l=n.next();return i=l.done,l},e:function(l){s=!0,o=l},f:function(){try{i||n.return==null||n.return()}finally{if(s)throw o}}}}function b(a,e,n){return(e=kn(e))in a?Object.defineProperty(a,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):a[e]=n,a}function Ir(a){if(typeof Symbol<"u"&&a[Symbol.iterator]!=null||a["@@iterator"]!=null)return Array.from(a)}function zr(a,e){var n=a==null?null:typeof Symbol<"u"&&a[Symbol.iterator]||a["@@iterator"];if(n!=null){var t,r,o,i,s=[],l=!0,c=!1;try{if(o=(n=n.call(a)).next,e===0){if(Object(n)!==n)return;l=!1}else for(;!(l=(t=o.call(n)).done)&&(s.push(t.value),s.length!==e);l=!0);}catch(m){c=!0,r=m}finally{try{if(!l&&n.return!=null&&(i=n.return(),Object(i)!==i))return}finally{if(c)throw r}}return s}}function Pr(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Cr(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function Re(a,e){var n=Object.keys(a);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(a);e&&(t=t.filter(function(r){return Object.getOwnPropertyDescriptor(a,r).enumerable})),n.push.apply(n,t)}return n}function d(a){for(var e=1;e<arguments.length;e++){var n=arguments[e]!=null?arguments[e]:{};e%2?Re(Object(n),!0).forEach(function(t){b(a,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(a,Object.getOwnPropertyDescriptors(n)):Re(Object(n)).forEach(function(t){Object.defineProperty(a,t,Object.getOwnPropertyDescriptor(n,t))})}return a}function Ga(a,e){return Sr(a)||zr(a,e)||ke(a,e)||Pr()}function D(a){return wr(a)||Ir(a)||ke(a)||Cr()}function Er(a,e){if(typeof a!="object"||!a)return a;var n=a[Symbol.toPrimitive];if(n!==void 0){var t=n.call(a,e);if(typeof t!="object")return t;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(a)}function kn(a){var e=Er(a,"string");return typeof e=="symbol"?e:e+""}function Ba(a){"@babel/helpers - typeof";return Ba=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},Ba(a)}function ke(a,e){if(a){if(typeof a=="string")return ie(a,e);var n={}.toString.call(a).slice(8,-1);return n==="Object"&&a.constructor&&(n=a.constructor.name),n==="Map"||n==="Set"?Array.from(a):n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?ie(a,e):void 0}}var $e=function(){},Ae={},An={},jn=null,In={mark:$e,measure:$e};try{typeof window<"u"&&(Ae=window),typeof document<"u"&&(An=document),typeof MutationObserver<"u"&&(jn=MutationObserver),typeof performance<"u"&&(In=performance)}catch{}var Fr=Ae.navigator||{},De=Fr.userAgent,We=De===void 0?"":De,Q=Ae,j=An,Ue=jn,La=In;Q.document;var G=!!j.documentElement&&!!j.head&&typeof j.addEventListener=="function"&&typeof j.createElement=="function",zn=~We.indexOf("MSIE")||~We.indexOf("Trident/"),_a,Mr=/fa(k|kd|s|r|l|t|d|dr|dl|dt|b|slr|slpr|wsb|tl|ns|nds|es|gt|jr|jfr|jdr|usb|ufsb|udsb|cr|ss|sr|sl|st|sds|sdr|sdl|sdt|sldr|slpdr|pr|ms|vs)?[\-\ ]/,Or=/Font ?Awesome ?([567 ]*)(Solid|Regular|Light|Thin|Duotone|Brands|Free|Pro|Sharp Duotone|Sharp|Kit|Notdog Duo|Notdog|Chisel|Etch|Graphite|Thumbprint|Jelly Fill|Jelly Duo|Jelly|Utility|Utility Fill|Utility Duo|Slab Press|Slab|Slab Duo|Slab Press Duo|Pixel|Mosaic|Vellum|Whiteboard)?.*/i,Pn={classic:{fa:"solid",fas:"solid","fa-solid":"solid",far:"regular","fa-regular":"regular",fal:"light","fa-light":"light",fat:"thin","fa-thin":"thin",fab:"brands","fa-brands":"brands"},duotone:{fa:"solid",fad:"solid","fa-solid":"solid","fa-duotone":"solid",fadr:"regular","fa-regular":"regular",fadl:"light","fa-light":"light",fadt:"thin","fa-thin":"thin"},sharp:{fa:"solid",fass:"solid","fa-solid":"solid",fasr:"regular","fa-regular":"regular",fasl:"light","fa-light":"light",fast:"thin","fa-thin":"thin"},"sharp-duotone":{fa:"solid",fasds:"solid","fa-solid":"solid",fasdr:"regular","fa-regular":"regular",fasdl:"light","fa-light":"light",fasdt:"thin","fa-thin":"thin"},slab:{"fa-regular":"regular",faslr:"regular"},"slab-press":{"fa-regular":"regular",faslpr:"regular"},"slab-duo":{"fa-regular":"regular",fasldr:"regular"},"slab-press-duo":{"fa-regular":"regular",faslpdr:"regular"},thumbprint:{"fa-light":"light",fatl:"light"},vellum:{"fa-solid":"solid",favs:"solid"},pixel:{"fa-regular":"regular",fapr:"regular"},mosaic:{"fa-solid":"solid",fams:"solid"},whiteboard:{"fa-semibold":"semibold",fawsb:"semibold"},notdog:{"fa-solid":"solid",fans:"solid"},"notdog-duo":{"fa-solid":"solid",fands:"solid"},etch:{"fa-solid":"solid",faes:"solid"},graphite:{"fa-thin":"thin",fagt:"thin"},jelly:{"fa-regular":"regular",fajr:"regular"},"jelly-fill":{"fa-regular":"regular",fajfr:"regular"},"jelly-duo":{"fa-regular":"regular",fajdr:"regular"},chisel:{"fa-regular":"regular",facr:"regular"},utility:{"fa-semibold":"semibold",fausb:"semibold"},"utility-duo":{"fa-semibold":"semibold",faudsb:"semibold"},"utility-fill":{"fa-semibold":"semibold",faufsb:"semibold"}},Lr={GROUP:"duotone-group",PRIMARY:"primary",SECONDARY:"secondary"},Cn=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone","fa-thumbprint","fa-whiteboard","fa-notdog","fa-notdog-duo","fa-chisel","fa-etch","fa-graphite","fa-jelly","fa-jelly-fill","fa-jelly-duo","fa-slab","fa-slab-press","fa-slab-press-duo","fa-slab-duo","fa-mosaic","fa-pixel","fa-vellum","fa-utility","fa-utility-duo","fa-utility-fill"],E="classic",Ca="duotone",En="sharp",Fn="sharp-duotone",Mn="chisel",On="etch",Ln="graphite",_n="jelly",Tn="jelly-duo",Nn="jelly-fill",Rn="mosaic",$n="notdog",Dn="notdog-duo",Wn="pixel",Un="slab",Yn="slab-duo",Bn="slab-press",Xn="slab-press-duo",Hn="thumbprint",Gn="utility",Vn="utility-duo",qn="utility-fill",Kn="vellum",Jn="whiteboard",_r="Classic",Tr="Duotone",Nr="Sharp",Rr="Sharp Duotone",$r="Chisel",Dr="Etch",Wr="Graphite",Ur="Jelly",Yr="Jelly Duo",Br="Jelly Fill",Xr="Mosaic",Hr="Notdog",Gr="Notdog Duo",Vr="Pixel",qr="Slab",Kr="Slab Duo",Jr="Slab Press",Qr="Slab Press Duo",Zr="Thumbprint",ai="Utility",ei="Utility Duo",ni="Utility Fill",ti="Vellum",ri="Whiteboard",Qn=[E,Ca,En,Fn,Mn,On,Ln,_n,Tn,Nn,Rn,$n,Dn,Wn,Un,Yn,Bn,Xn,Hn,Gn,Vn,qn,Kn,Jn];_a={},b(b(b(b(b(b(b(b(b(b(_a,E,_r),Ca,Tr),En,Nr),Fn,Rr),Mn,$r),On,Dr),Ln,Wr),_n,Ur),Tn,Yr),Nn,Br),b(b(b(b(b(b(b(b(b(b(_a,Rn,Xr),$n,Hr),Dn,Gr),Wn,Vr),Un,qr),Yn,Kr),Bn,Jr),Xn,Qr),Hn,Zr),Gn,ai),b(b(b(b(_a,Vn,ei),qn,ni),Kn,ti),Jn,ri);var ii={classic:{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},duotone:{900:"fad",400:"fadr",300:"fadl",100:"fadt"},sharp:{900:"fass",400:"fasr",300:"fasl",100:"fast"},"sharp-duotone":{900:"fasds",400:"fasdr",300:"fasdl",100:"fasdt"},slab:{400:"faslr"},"slab-press":{400:"faslpr"},"slab-duo":{400:"fasldr"},"slab-press-duo":{400:"faslpdr"},vellum:{900:"favs"},mosaic:{900:"fams"},pixel:{400:"fapr"},whiteboard:{600:"fawsb"},thumbprint:{300:"fatl"},notdog:{900:"fans"},"notdog-duo":{900:"fands"},etch:{900:"faes"},graphite:{100:"fagt"},chisel:{400:"facr"},jelly:{400:"fajr"},"jelly-fill":{400:"fajfr"},"jelly-duo":{400:"fajdr"},utility:{600:"fausb"},"utility-duo":{600:"faudsb"},"utility-fill":{600:"faufsb"}},oi={"Font Awesome 7 Free":{900:"fas",400:"far"},"Font Awesome 7 Pro":{900:"fas",400:"far",normal:"far",300:"fal",100:"fat"},"Font Awesome 7 Brands":{400:"fab",normal:"fab"},"Font Awesome 7 Duotone":{900:"fad",400:"fadr",normal:"fadr",300:"fadl",100:"fadt"},"Font Awesome 7 Sharp":{900:"fass",400:"fasr",normal:"fasr",300:"fasl",100:"fast"},"Font Awesome 7 Sharp Duotone":{900:"fasds",400:"fasdr",normal:"fasdr",300:"fasdl",100:"fasdt"},"Font Awesome 7 Jelly":{400:"fajr",normal:"fajr"},"Font Awesome 7 Jelly Fill":{400:"fajfr",normal:"fajfr"},"Font Awesome 7 Jelly Duo":{400:"fajdr",normal:"fajdr"},"Font Awesome 7 Slab":{400:"faslr",normal:"faslr"},"Font Awesome 7 Slab Press":{400:"faslpr",normal:"faslpr"},"Font Awesome 7 Slab Duo":{400:"fasldr",normal:"fasldr"},"Font Awesome 7 Slab Press Duo":{400:"faslpdr",normal:"faslpdr"},"Font Awesome 7 Pixel":{400:"fapr",normal:"fapr"},"Font Awesome 7 Mosaic":{900:"fams",normal:"fams"},"Font Awesome 7 Vellum":{900:"favs",normal:"favs"},"Font Awesome 7 Thumbprint":{300:"fatl",normal:"fatl"},"Font Awesome 7 Notdog":{900:"fans",normal:"fans"},"Font Awesome 7 Notdog Duo":{900:"fands",normal:"fands"},"Font Awesome 7 Etch":{900:"faes",normal:"faes"},"Font Awesome 7 Graphite":{100:"fagt",normal:"fagt"},"Font Awesome 7 Chisel":{400:"facr",normal:"facr"},"Font Awesome 7 Whiteboard":{600:"fawsb",normal:"fawsb"},"Font Awesome 7 Utility":{600:"fausb",normal:"fausb"},"Font Awesome 7 Utility Duo":{600:"faudsb",normal:"faudsb"},"Font Awesome 7 Utility Fill":{600:"faufsb",normal:"faufsb"}},si=new Map([["classic",{defaultShortPrefixId:"fas",defaultStyleId:"solid",styleIds:["solid","regular","light","thin","brands"],futureStyleIds:[],defaultFontWeight:900}],["duotone",{defaultShortPrefixId:"fad",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["sharp",{defaultShortPrefixId:"fass",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["sharp-duotone",{defaultShortPrefixId:"fasds",defaultStyleId:"solid",styleIds:["solid","regular","light","thin"],futureStyleIds:[],defaultFontWeight:900}],["chisel",{defaultShortPrefixId:"facr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["etch",{defaultShortPrefixId:"faes",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["graphite",{defaultShortPrefixId:"fagt",defaultStyleId:"thin",styleIds:["thin"],futureStyleIds:[],defaultFontWeight:100}],["jelly",{defaultShortPrefixId:"fajr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["jelly-duo",{defaultShortPrefixId:"fajdr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["jelly-fill",{defaultShortPrefixId:"fajfr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["mosaic",{defaultShortPrefixId:"fams",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["notdog",{defaultShortPrefixId:"fans",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["notdog-duo",{defaultShortPrefixId:"fands",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["pixel",{defaultShortPrefixId:"fapr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["slab",{defaultShortPrefixId:"faslr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["slab-duo",{defaultShortPrefixId:"fasldr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["slab-press",{defaultShortPrefixId:"faslpr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["slab-press-duo",{defaultShortPrefixId:"faslpdr",defaultStyleId:"regular",styleIds:["regular"],futureStyleIds:[],defaultFontWeight:400}],["thumbprint",{defaultShortPrefixId:"fatl",defaultStyleId:"light",styleIds:["light"],futureStyleIds:[],defaultFontWeight:300}],["utility",{defaultShortPrefixId:"fausb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}],["utility-duo",{defaultShortPrefixId:"faudsb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}],["utility-fill",{defaultShortPrefixId:"faufsb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}],["vellum",{defaultShortPrefixId:"favs",defaultStyleId:"solid",styleIds:["solid"],futureStyleIds:[],defaultFontWeight:900}],["whiteboard",{defaultShortPrefixId:"fawsb",defaultStyleId:"semibold",styleIds:["semibold"],futureStyleIds:[],defaultFontWeight:600}]]),li={chisel:{regular:"facr"},classic:{brands:"fab",light:"fal",regular:"far",solid:"fas",thin:"fat"},duotone:{light:"fadl",regular:"fadr",solid:"fad",thin:"fadt"},etch:{solid:"faes"},graphite:{thin:"fagt"},jelly:{regular:"fajr"},"jelly-duo":{regular:"fajdr"},"jelly-fill":{regular:"fajfr"},mosaic:{solid:"fams"},notdog:{solid:"fans"},"notdog-duo":{solid:"fands"},pixel:{regular:"fapr"},sharp:{light:"fasl",regular:"fasr",solid:"fass",thin:"fast"},"sharp-duotone":{light:"fasdl",regular:"fasdr",solid:"fasds",thin:"fasdt"},slab:{regular:"faslr"},"slab-duo":{regular:"fasldr"},"slab-press":{regular:"faslpr"},"slab-press-duo":{regular:"faslpdr"},thumbprint:{light:"fatl"},utility:{semibold:"fausb"},"utility-duo":{semibold:"faudsb"},"utility-fill":{semibold:"faufsb"},vellum:{solid:"favs"},whiteboard:{semibold:"fawsb"}},Zn=["fak","fa-kit","fakd","fa-kit-duotone"],Ye={kit:{fak:"kit","fa-kit":"kit"},"kit-duotone":{fakd:"kit-duotone","fa-kit-duotone":"kit-duotone"}},fi=["kit"],ci="kit",ui="kit-duotone",di="Kit",mi="Kit Duotone";b(b({},ci,di),ui,mi);var gi={kit:{"fa-kit":"fak"}},pi={"Font Awesome Kit":{400:"fak",normal:"fak"},"Font Awesome Kit Duotone":{400:"fakd",normal:"fakd"}},hi={kit:{fak:"fa-kit"}},Be={kit:{kit:"fak"},"kit-duotone":{"kit-duotone":"fakd"}},Ta,Na={GROUP:"duotone-group",SWAP_OPACITY:"swap-opacity",PRIMARY:"primary",SECONDARY:"secondary"},vi=["fa-classic","fa-duotone","fa-sharp","fa-sharp-duotone","fa-thumbprint","fa-whiteboard","fa-notdog","fa-notdog-duo","fa-chisel","fa-etch","fa-graphite","fa-jelly","fa-jelly-fill","fa-jelly-duo","fa-slab","fa-slab-press","fa-slab-press-duo","fa-slab-duo","fa-mosaic","fa-pixel","fa-vellum","fa-utility","fa-utility-duo","fa-utility-fill"],bi="classic",yi="duotone",xi="sharp",Si="sharp-duotone",wi="chisel",ki="etch",Ai="graphite",ji="jelly",Ii="jelly-duo",zi="jelly-fill",Pi="mosaic",Ci="notdog",Ei="notdog-duo",Fi="pixel",Mi="slab",Oi="slab-duo",Li="slab-press",_i="slab-press-duo",Ti="thumbprint",Ni="utility",Ri="utility-duo",$i="utility-fill",Di="vellum",Wi="whiteboard",Ui="Classic",Yi="Duotone",Bi="Sharp",Xi="Sharp Duotone",Hi="Chisel",Gi="Etch",Vi="Graphite",qi="Jelly",Ki="Jelly Duo",Ji="Jelly Fill",Qi="Mosaic",Zi="Notdog",ao="Notdog Duo",eo="Pixel",no="Slab",to="Slab Duo",ro="Slab Press",io="Slab Press Duo",oo="Thumbprint",so="Utility",lo="Utility Duo",fo="Utility Fill",co="Vellum",uo="Whiteboard";Ta={},b(b(b(b(b(b(b(b(b(b(Ta,bi,Ui),yi,Yi),xi,Bi),Si,Xi),wi,Hi),ki,Gi),Ai,Vi),ji,qi),Ii,Ki),zi,Ji),b(b(b(b(b(b(b(b(b(b(Ta,Pi,Qi),Ci,Zi),Ei,ao),Fi,eo),Mi,no),Oi,to),Li,ro),_i,io),Ti,oo),Ni,so),b(b(b(b(Ta,Ri,lo),$i,fo),Di,co),Wi,uo);var mo="kit",go="kit-duotone",po="Kit",ho="Kit Duotone";b(b({},mo,po),go,ho);var vo={classic:{"fa-brands":"fab","fa-duotone":"fad","fa-light":"fal","fa-regular":"far","fa-solid":"fas","fa-thin":"fat"},duotone:{"fa-regular":"fadr","fa-light":"fadl","fa-thin":"fadt"},sharp:{"fa-solid":"fass","fa-regular":"fasr","fa-light":"fasl","fa-thin":"fast"},"sharp-duotone":{"fa-solid":"fasds","fa-regular":"fasdr","fa-light":"fasdl","fa-thin":"fasdt"},slab:{"fa-regular":"faslr"},"slab-press":{"fa-regular":"faslpr"},"slab-duo":{"fa-regular":"fasldr"},"slab-press-duo":{"fa-regular":"faslpdr"},pixel:{"fa-regular":"fapr"},mosaic:{"fa-solid":"fams"},vellum:{"fa-solid":"favs"},whiteboard:{"fa-semibold":"fawsb"},thumbprint:{"fa-light":"fatl"},notdog:{"fa-solid":"fans"},"notdog-duo":{"fa-solid":"fands"},etch:{"fa-solid":"faes"},graphite:{"fa-thin":"fagt"},jelly:{"fa-regular":"fajr"},"jelly-fill":{"fa-regular":"fajfr"},"jelly-duo":{"fa-regular":"fajdr"},chisel:{"fa-regular":"facr"},utility:{"fa-semibold":"fausb"},"utility-duo":{"fa-semibold":"faudsb"},"utility-fill":{"fa-semibold":"faufsb"}},bo={classic:["fas","far","fal","fat","fad"],duotone:["fadr","fadl","fadt"],sharp:["fass","fasr","fasl","fast"],"sharp-duotone":["fasds","fasdr","fasdl","fasdt"],slab:["faslr"],"slab-press":["faslpr"],"slab-duo":["fasldr"],"slab-press-duo":["faslpdr"],pixel:["fapr"],mosaic:["fams"],vellum:["favs"],whiteboard:["fawsb"],thumbprint:["fatl"],notdog:["fans"],"notdog-duo":["fands"],etch:["faes"],graphite:["fagt"],jelly:["fajr"],"jelly-fill":["fajfr"],"jelly-duo":["fajdr"],chisel:["facr"],utility:["fausb"],"utility-duo":["faudsb"],"utility-fill":["faufsb"]},oe={classic:{fab:"fa-brands",fad:"fa-duotone",fal:"fa-light",far:"fa-regular",fas:"fa-solid",fat:"fa-thin"},duotone:{fadr:"fa-regular",fadl:"fa-light",fadt:"fa-thin"},sharp:{fass:"fa-solid",fasr:"fa-regular",fasl:"fa-light",fast:"fa-thin"},"sharp-duotone":{fasds:"fa-solid",fasdr:"fa-regular",fasdl:"fa-light",fasdt:"fa-thin"},slab:{faslr:"fa-regular"},"slab-press":{faslpr:"fa-regular"},"slab-duo":{fasldr:"fa-regular"},"slab-press-duo":{faslpdr:"fa-regular"},pixel:{fapr:"fa-regular"},mosaic:{fams:"fa-solid"},vellum:{favs:"fa-solid"},whiteboard:{fawsb:"fa-semibold"},thumbprint:{fatl:"fa-light"},notdog:{fans:"fa-solid"},"notdog-duo":{fands:"fa-solid"},etch:{faes:"fa-solid"},graphite:{fagt:"fa-thin"},jelly:{fajr:"fa-regular"},"jelly-fill":{fajfr:"fa-regular"},"jelly-duo":{fajdr:"fa-regular"},chisel:{facr:"fa-regular"},utility:{fausb:"fa-semibold"},"utility-duo":{faudsb:"fa-semibold"},"utility-fill":{faufsb:"fa-semibold"}},yo=["fa-solid","fa-regular","fa-light","fa-thin","fa-duotone","fa-brands","fa-semibold"],at=["fa","fas","far","fal","fat","fad","fadr","fadl","fadt","fab","fass","fasr","fasl","fast","fasds","fasdr","fasdl","fasdt","faslr","faslpr","fasldr","faslpdr","fapr","fams","favs","fawsb","fatl","fans","fands","faes","fagt","fajr","fajfr","fajdr","facr","fausb","faudsb","faufsb"].concat(vi,yo),xo=["solid","regular","light","thin","duotone","brands","semibold"],et=[1,2,3,4,5,6,7,8,9,10],So=et.concat([11,12,13,14,15,16,17,18,19,20]),wo=["aw","fw","pull-left","pull-right"],ko=[].concat(D(Object.keys(bo)),xo,wo,["2xs","xs","sm","lg","xl","2xl","beat","beat-fade","border","bounce","buzz","canvas-square","canvas-roomy","fade","flip-360","flip-both","flip-horizontal","flip-vertical","flip","float","inverse","jello","layers","layers-bottom-left","layers-bottom-right","layers-counter","layers-text","layers-top-left","layers-top-right","li","pull-end","pull-start","pulse","rotate-180","rotate-270","rotate-90","rotate-by","shake","spin-pulse","spin-reverse","spin","spin-snap","spin-snap-4","spin-snap-8","stack-1x","stack-2x","stack","swing","ul","wag","width-auto","width-fixed",Na.GROUP,Na.SWAP_OPACITY,Na.PRIMARY,Na.SECONDARY]).concat(et.map(function(a){return"".concat(a,"x")})).concat(So.map(function(a){return"w-".concat(a)})),Ao={"Font Awesome 5 Free":{900:"fas",400:"far"},"Font Awesome 5 Pro":{900:"fas",400:"far",normal:"far",300:"fal"},"Font Awesome 5 Brands":{400:"fab",normal:"fab"},"Font Awesome 5 Duotone":{900:"fad"}},X="___FONT_AWESOME___",se=16,nt="fa",tt="svg-inline--fa",ta="data-fa-i2svg",le="data-fa-pseudo-element",jo="data-fa-pseudo-element-pending",je="data-prefix",Ie="data-icon",Xe="fontawesome-i2svg",Io="async",zo=["HTML","HEAD","STYLE","SCRIPT"],rt=["::before","::after",":before",":after"],it=(function(){try{return!0}catch{return!1}})();function Ea(a){return new Proxy(a,{get:function(n,t){return t in n?n[t]:n[E]}})}var ot=d({},Pn);ot[E]=d(d(d(d({},{"fa-duotone":"duotone"}),Pn[E]),Ye.kit),Ye["kit-duotone"]);var Po=Ea(ot),fe=d({},li);fe[E]=d(d(d(d({},{duotone:"fad"}),fe[E]),Be.kit),Be["kit-duotone"]);var He=Ea(fe),ce=d({},oe);ce[E]=d(d({},ce[E]),hi.kit);var ze=Ea(ce),ue=d({},vo);ue[E]=d(d({},ue[E]),gi.kit);Ea(ue);var Co=Mr,st="fa-layers-text",Eo=Or,Fo=d({},ii);Ea(Fo);var Mo=["class","data-prefix","data-icon","data-fa-transform","data-fa-mask"],ae=Lr,Oo=[].concat(D(fi),D(ko)),ja=Q.FontAwesomeConfig||{};function Lo(a){var e=j.querySelector("script["+a+"]");if(e)return e.getAttribute(a)}function _o(a){return a===""?!0:a==="false"?!1:a==="true"?!0:a}if(j&&typeof j.querySelector=="function"){var To=[["data-family-prefix","familyPrefix"],["data-css-prefix","cssPrefix"],["data-family-default","familyDefault"],["data-style-default","styleDefault"],["data-replacement-class","replacementClass"],["data-auto-replace-svg","autoReplaceSvg"],["data-auto-add-css","autoAddCss"],["data-search-pseudo-elements","searchPseudoElements"],["data-search-pseudo-elements-warnings","searchPseudoElementsWarnings"],["data-search-pseudo-elements-full-scan","searchPseudoElementsFullScan"],["data-observe-mutations","observeMutations"],["data-mutate-approach","mutateApproach"],["data-keep-original-source","keepOriginalSource"],["data-measure-performance","measurePerformance"],["data-show-missing-icons","showMissingIcons"]];To.forEach(function(a){var e=Ga(a,2),n=e[0],t=e[1],r=_o(Lo(n));r!=null&&(ja[t]=r)})}var lt={styleDefault:"solid",familyDefault:E,cssPrefix:nt,replacementClass:tt,autoReplaceSvg:!0,autoAddCss:!0,searchPseudoElements:!1,searchPseudoElementsWarnings:!0,searchPseudoElementsFullScan:!1,observeMutations:!0,mutateApproach:"async",keepOriginalSource:!0,measurePerformance:!1,showMissingIcons:!0};ja.familyPrefix&&(ja.cssPrefix=ja.familyPrefix);var ha=d(d({},lt),ja);ha.autoReplaceSvg||(ha.observeMutations=!1);var v={};Object.keys(lt).forEach(function(a){Object.defineProperty(v,a,{enumerable:!0,set:function(n){ha[a]=n,Ia.forEach(function(t){return t(v)})},get:function(){return ha[a]}})});Object.defineProperty(v,"familyPrefix",{enumerable:!0,set:function(e){ha.cssPrefix=e,Ia.forEach(function(n){return n(v)})},get:function(){return ha.cssPrefix}});Q.FontAwesomeConfig=v;var Ia=[];function No(a){return Ia.push(a),function(){Ia.splice(Ia.indexOf(a),1)}}var ua=se,U={size:16,x:0,y:0,rotate:0,flipX:!1,flipY:!1};function Ro(a){if(!(!a||!G)){var e=j.createElement("style");e.setAttribute("type","text/css"),e.innerHTML=a;for(var n=j.head.childNodes,t=null,r=n.length-1;r>-1;r--){var o=n[r],i=(o.tagName||"").toUpperCase();["STYLE","LINK"].indexOf(i)>-1&&(t=o)}return j.head.insertBefore(e,t),a}}var $o="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function Ge(){for(var a=12,e="";a-- >0;)e+=$o[Math.random()*62|0];return e}function ya(a){for(var e=[],n=(a||[]).length>>>0;n--;)e[n]=a[n];return e}function Pe(a){return a.classList?ya(a.classList):(a.getAttribute("class")||"").split(" ").filter(function(e){return e})}function ft(a){return"".concat(a).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function Do(a){return Object.keys(a||{}).reduce(function(e,n){return e+"".concat(n,'="').concat(ft(a[n]),'" ')},"").trim()}function Va(a){return Object.keys(a||{}).reduce(function(e,n){return e+"".concat(n,": ").concat(a[n].trim(),";")},"")}function Ce(a){return a.size!==U.size||a.x!==U.x||a.y!==U.y||a.rotate!==U.rotate||a.flipX||a.flipY}function Wo(a){var e=a.transform,n=a.containerWidth,t=a.iconWidth,r={transform:"translate(".concat(n/2," 256)")},o="translate(".concat(e.x*32,", ").concat(e.y*32,") "),i="scale(".concat(e.size/16*(e.flipX?-1:1),", ").concat(e.size/16*(e.flipY?-1:1),") "),s="rotate(".concat(e.rotate," 0 0)"),l={transform:"".concat(o," ").concat(i," ").concat(s)},c={transform:"translate(".concat(t/2*-1," -256)")};return{outer:r,inner:l,path:c}}function Uo(a){var e=a.transform,n=a.width,t=n===void 0?se:n,r=a.height,o=r===void 0?se:r,i="";return zn?i+="translate(".concat(e.x/ua-t/2,"em, ").concat(e.y/ua-o/2,"em) "):i+="translate(calc(-50% + ".concat(e.x/ua,"em), calc(-50% + ").concat(e.y/ua,"em)) "),i+="scale(".concat(e.size/ua*(e.flipX?-1:1),", ").concat(e.size/ua*(e.flipY?-1:1),") "),i+="rotate(".concat(e.rotate,"deg) "),i}var Yo=`:root, :host {
  --fa-font-solid: normal 900 1em/1 'Font Awesome 7 Free';
  --fa-font-regular: normal 400 1em/1 'Font Awesome 7 Free';
  --fa-font-light: normal 300 1em/1 'Font Awesome 7 Pro';
  --fa-font-thin: normal 100 1em/1 'Font Awesome 7 Pro';
  --fa-font-duotone: normal 900 1em/1 'Font Awesome 7 Duotone';
  --fa-font-duotone-regular: normal 400 1em/1 'Font Awesome 7 Duotone';
  --fa-font-duotone-light: normal 300 1em/1 'Font Awesome 7 Duotone';
  --fa-font-duotone-thin: normal 100 1em/1 'Font Awesome 7 Duotone';
  --fa-font-brands: normal 400 1em/1 'Font Awesome 7 Brands';
  --fa-font-sharp-solid: normal 900 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-regular: normal 400 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-light: normal 300 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-thin: normal 100 1em/1 'Font Awesome 7 Sharp';
  --fa-font-sharp-duotone-solid: normal 900 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-sharp-duotone-regular: normal 400 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-sharp-duotone-light: normal 300 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-sharp-duotone-thin: normal 100 1em/1 'Font Awesome 7 Sharp Duotone';
  --fa-font-slab-regular: normal 400 1em/1 'Font Awesome 7 Slab';
  --fa-font-slab-press-regular: normal 400 1em/1 'Font Awesome 7 Slab Press';
  --fa-font-slab-duo-regular: normal 400 1em/1 'Font Awesome 7 Slab Duo';
  --fa-font-slab-press-duo-regular: normal 400 1em/1 'Font Awesome 7 Slab Press Duo';
  --fa-font-pixel-regular: normal 400 1em/1 'Font Awesome 7 Pixel';
  --fa-font-mosaic-solid: normal 900 1em/1 'Font Awesome 7 Mosaic';
  --fa-font-vellum-solid: normal 900 1em/1 'Font Awesome 7 Vellum';
  --fa-font-whiteboard-semibold: normal 600 1em/1 'Font Awesome 7 Whiteboard';
  --fa-font-thumbprint-light: normal 300 1em/1 'Font Awesome 7 Thumbprint';
  --fa-font-notdog-solid: normal 900 1em/1 'Font Awesome 7 Notdog';
  --fa-font-notdog-duo-solid: normal 900 1em/1 'Font Awesome 7 Notdog Duo';
  --fa-font-etch-solid: normal 900 1em/1 'Font Awesome 7 Etch';
  --fa-font-graphite-thin: normal 100 1em/1 'Font Awesome 7 Graphite';
  --fa-font-jelly-regular: normal 400 1em/1 'Font Awesome 7 Jelly';
  --fa-font-jelly-fill-regular: normal 400 1em/1 'Font Awesome 7 Jelly Fill';
  --fa-font-jelly-duo-regular: normal 400 1em/1 'Font Awesome 7 Jelly Duo';
  --fa-font-chisel-regular: normal 400 1em/1 'Font Awesome 7 Chisel';
  --fa-font-utility-semibold: normal 600 1em/1 'Font Awesome 7 Utility';
  --fa-font-utility-duo-semibold: normal 600 1em/1 'Font Awesome 7 Utility Duo';
  --fa-font-utility-fill-semibold: normal 600 1em/1 'Font Awesome 7 Utility Fill';
}

.svg-inline--fa {
  box-sizing: content-box;
  display: var(--fa-display, inline-block);
  height: 1em;
  overflow: visible;
  vertical-align: -0.125em;
  width: var(--fa-width, 1.25em);
}
.svg-inline--fa.fa-2xs {
  vertical-align: 0.1em;
}
.svg-inline--fa.fa-xs {
  vertical-align: 0em;
}
.svg-inline--fa.fa-sm {
  vertical-align: -0.0714285714em;
}
.svg-inline--fa.fa-lg {
  vertical-align: -0.2em;
}
.svg-inline--fa.fa-xl {
  vertical-align: -0.25em;
}
.svg-inline--fa.fa-2xl {
  vertical-align: -0.3125em;
}
.svg-inline--fa.fa-pull-left,
.svg-inline--fa .fa-pull-start {
  float: inline-start;
  margin-inline-end: var(--fa-pull-margin, 0.3em);
}
.svg-inline--fa.fa-pull-right,
.svg-inline--fa .fa-pull-end {
  float: inline-end;
  margin-inline-start: var(--fa-pull-margin, 0.3em);
}
.svg-inline--fa.fa-li {
  width: var(--fa-li-width, 2em);
  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));
  inset-block-start: 0.25em; /* syncing vertical alignment with Web Font rendering */
}

.fa-layers-counter, .fa-layers-text {
  display: inline-block;
  position: absolute;
  text-align: center;
}

.fa-layers {
  display: inline-block;
  height: 1em;
  position: relative;
  text-align: center;
  vertical-align: -0.125em;
  width: var(--fa-width, 1.25em);
}
.fa-layers .svg-inline--fa {
  inset: 0;
  margin: auto;
  position: absolute;
  transform-origin: center center;
}

.fa-layers-text {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transform-origin: center center;
}

.fa-layers-counter {
  background-color: var(--fa-counter-background-color, #ff253a);
  border-radius: var(--fa-counter-border-radius, 1em);
  box-sizing: border-box;
  color: var(--fa-inverse, #fff);
  line-height: var(--fa-counter-line-height, 1);
  max-width: var(--fa-counter-max-width, 5em);
  min-width: var(--fa-counter-min-width, 1.5em);
  overflow: hidden;
  padding: var(--fa-counter-padding, 0.25em 0.5em);
  right: var(--fa-right, 0);
  text-overflow: ellipsis;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-counter-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-bottom-right {
  bottom: var(--fa-bottom, 0);
  right: var(--fa-right, 0);
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom right;
}

.fa-layers-bottom-left {
  bottom: var(--fa-bottom, 0);
  left: var(--fa-left, 0);
  right: auto;
  top: auto;
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: bottom left;
}

.fa-layers-top-right {
  top: var(--fa-top, 0);
  right: var(--fa-right, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top right;
}

.fa-layers-top-left {
  left: var(--fa-left, 0);
  right: auto;
  top: var(--fa-top, 0);
  transform: scale(var(--fa-layers-scale, 0.25));
  transform-origin: top left;
}

.fa-1x {
  font-size: 1em;
}

.fa-2x {
  font-size: 2em;
}

.fa-3x {
  font-size: 3em;
}

.fa-4x {
  font-size: 4em;
}

.fa-5x {
  font-size: 5em;
}

.fa-6x {
  font-size: 6em;
}

.fa-7x {
  font-size: 7em;
}

.fa-8x {
  font-size: 8em;
}

.fa-9x {
  font-size: 9em;
}

.fa-10x {
  font-size: 10em;
}

.fa-2xs {
  font-size: calc(10 / 16 * 1em); /* converts a 10px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 10 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 10 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-xs {
  font-size: calc(12 / 16 * 1em); /* converts a 12px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 12 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 12 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-sm {
  font-size: calc(14 / 16 * 1em); /* converts a 14px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 14 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 14 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-lg {
  font-size: calc(20 / 16 * 1em); /* converts a 20px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 20 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 20 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-xl {
  font-size: calc(24 / 16 * 1em); /* converts a 24px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 24 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 24 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-2xl {
  font-size: calc(32 / 16 * 1em); /* converts a 32px size into an em-based value that's relative to the scale's 16px base */
  line-height: calc(1 / 32 * 1em); /* sets the line-height of the icon back to that of it's parent */
  vertical-align: calc((6 / 32 - 0.375) * 1em); /* vertically centers the icon taking into account the surrounding text's descender */
}

.fa-width-auto {
  --fa-width: auto;
}

.fa-fw,
.fa-width-fixed {
  --fa-width: 1.25em;
}

.fa-canvas-square {
  padding-block: 0.125em;
  margin-block-end: -0.125em;
}

.fa-canvas-roomy {
  padding-block: 0.25em;
  padding-inline: 0.125em;
  margin-block-end: -0.25em;
  box-sizing: content-box;
}

.fa-ul {
  list-style-type: none;
  margin-inline-start: var(--fa-li-margin, 2.5em);
  padding-inline-start: 0;
}
.fa-ul > li {
  position: relative;
}

.fa-li {
  inset-inline-start: calc(-1 * var(--fa-li-width, 2em));
  position: absolute;
  text-align: center;
  width: var(--fa-li-width, 2em);
  line-height: inherit;
}

/* Heads Up: Bordered Icons will not be supported in the future!
  - This feature will be deprecated in the next major release of Font Awesome (v8)!
  - You may continue to use it in this version *v7), but it will not be supported in Font Awesome v8.
*/
/* Notes:
* --@{v.$css-prefix}-border-width = 1/16 by default (to render as ~1px based on a 16px default font-size)
* --@{v.$css-prefix}-border-padding =
  ** 3/16 for vertical padding (to give ~2px of vertical whitespace around an icon considering it's vertical alignment)
  ** 4/16 for horizontal padding (to give ~4px of horizontal whitespace around an icon)
*/
.fa-border {
  border-color: var(--fa-border-color, #eee);
  border-radius: var(--fa-border-radius, 0.1em);
  border-style: var(--fa-border-style, solid);
  border-width: var(--fa-border-width, 0.0625em);
  box-sizing: var(--fa-border-box-sizing, content-box);
  padding: var(--fa-border-padding, 0.1875em 0.25em);
}

.fa-pull-left,
.fa-pull-start {
  float: inline-start;
  margin-inline-end: var(--fa-pull-margin, 0.3em);
}

.fa-pull-right,
.fa-pull-end {
  float: inline-end;
  margin-inline-start: var(--fa-pull-margin, 0.3em);
}

.fa-beat {
  animation-name: fa-beat;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-bounce {
  animation-name: fa-bounce;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, cubic-bezier(0.28, 0.84, 0.42, 1));
}

.fa-fade {
  animation-name: fa-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-beat-fade {
  animation-name: fa-beat-fade;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-flip {
  animation-name: fa-flip;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1.5s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-flip-360 {
  animation-name: fa-flip-360;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-shake {
  animation-name: fa-shake;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 0.75s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
}

.fa-spin {
  animation-name: fa-spin;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 2s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin-reverse {
  --fa-animation-direction: reverse;
}

.fa-pulse,
.fa-spin-pulse {
  animation-name: fa-spin;
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, steps(8));
}

.fa-spin-snap {
  animation-name: fa-spin-snap;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 3s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin-snap-4 {
  animation-name: fa-spin-snap-4;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 2.4s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-spin-snap-8 {
  animation-name: fa-spin-snap-8;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 4s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-buzz {
  animation-name: fa-buzz;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 0.6s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, linear);
}

.fa-wag {
  animation-name: fa-wag;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 0.9s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-out);
  transform-origin: bottom center;
}

.fa-float {
  animation-name: fa-float;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 3s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-in-out);
  will-change: transform;
}

.fa-swing {
  animation-name: fa-swing;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 1.2s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-out);
  transform-origin: top center;
}

.fa-jello {
  animation-name: fa-jello;
  animation-delay: var(--fa-animation-delay, 0s);
  animation-direction: var(--fa-animation-direction, normal);
  animation-duration: var(--fa-animation-duration, 0.9s);
  animation-iteration-count: var(--fa-animation-iteration-count, infinite);
  animation-timing-function: var(--fa-animation-timing, ease-out);
}

@media (prefers-reduced-motion: reduce) {
  .fa-beat,
  .fa-bounce,
  .fa-fade,
  .fa-beat-fade,
  .fa-flip,
  .fa-flip-360,
  .fa-pulse,
  .fa-shake,
  .fa-spin,
  .fa-spin-pulse,
  .fa-buzz,
  .fa-float,
  .fa-jello,
  .fa-spin-snap,
  .fa-spin-snap-4,
  .fa-spin-snap-8,
  .fa-swing,
  .fa-wag {
    animation: none !important;
    transition: none !important;
  }
}
@keyframes fa-beat {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(calc(1.25 * var(--fa-beat-scale, 1.25)));
  }
  45% {
    transform: scale(calc(1.22 * var(--fa-beat-scale, 1.22)));
  }
  65% {
    transform: scale(calc(1.25 * var(--fa-beat-scale, 1.25)));
  }
  90% {
    transform: scale(1);
  }
}
@keyframes fa-bounce {
  0% {
    transform: scale(1, 1) translateY(0);
    animation-timing-function: var(--fa-animation-timing);
  }
  14% {
    transform: scale(var(--fa-bounce-start-scale-x, 1.06), var(--fa-bounce-start-scale-y, 0.94)) translateY(var(--fa-bounce-anticipation, 3px));
    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
  }
  32% {
    transform: scale(var(--fa-bounce-jump-scale-x, 0.94), var(--fa-bounce-jump-scale-y, 1.12)) translateY(calc(-1 * var(--fa-bounce-height, 0.5em)));
    animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
  }
  52% {
    transform: scale(1, 1) translateY(calc(-1 * var(--fa-bounce-height, 0.5em) * 1.1));
    animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);
  }
  70% {
    transform: scale(var(--fa-bounce-land-scale-x, 1.06), var(--fa-bounce-land-scale-y, 0.92)) translateY(0);
    animation-timing-function: cubic-bezier(0.33, 0.33, 0.66, 1);
  }
  85% {
    transform: scale(0.98, 1.04) translateY(calc(-2px * var(--fa-bounce-rebound, 1)));
    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
  }
  100% {
    transform: scale(1, 1) translateY(0);
  }
}
@keyframes fa-fade {
  0% {
    opacity: 1;
    transform: scale(1);
    animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
  }
  40% {
    opacity: var(--fa-fade-opacity, 0.4);
    transform: scale(0.98);
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes fa-beat-fade {
  0% {
    opacity: var(--fa-beat-fade-opacity, 0.4);
    transform: scale(1);
    animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
  }
  25% {
    opacity: calc(var(--fa-beat-fade-opacity, 0.4) + 0.4);
    transform: scale(var(--fa-beat-fade-scale, 1.28));
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  45% {
    opacity: 1;
    transform: scale(var(--fa-beat-fade-scale, 1.25));
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  65% {
    opacity: calc(var(--fa-beat-fade-opacity, 0.4) + 0.4);
    transform: scale(var(--fa-beat-fade-scale, 1.28));
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  100% {
    opacity: var(--fa-beat-fade-opacity, 0.4);
    transform: scale(1);
  }
}
@keyframes fa-flip {
  0% {
    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), 0deg);
    animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
  }
  8% {
    transform: perspective(2em) scale(var(--fa-flip-anticipation-scale, 0.95)) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), 0deg);
    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
  }
  35% {
    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), calc(var(--fa-flip-angle, -360deg) * 0.6));
    animation-timing-function: linear;
  }
  65% {
    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), calc(var(--fa-flip-angle, -360deg) * 0.5));
    animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
  }
  92% {
    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), calc(var(--fa-flip-angle, -360deg) * var(--fa-flip-overshoot, 1.04)));
    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
  }
  100% {
    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -360deg));
  }
}
@keyframes fa-flip-360 {
  0% {
    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), 0deg);
    animation-timing-function: cubic-bezier(0.2, 0, 0.4, 1);
  }
  8% {
    transform: perspective(2em) scale(var(--fa-flip-anticipation-scale, 0.95)) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), 0deg);
    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
  }
  50% {
    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), calc(var(--fa-flip-angle, -360deg) * 0.6));
    animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
  }
  80% {
    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), calc(var(--fa-flip-angle, -360deg) * var(--fa-flip-overshoot, 1.04)));
    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
  }
  100% {
    transform: perspective(2em) scale(1) rotate3d(var(--fa-flip-x, 0), var(--fa-flip-y, 1), var(--fa-flip-z, 0), var(--fa-flip-angle, -360deg));
  }
}
@keyframes fa-shake {
  0% {
    transform: rotate(0deg);
    animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1);
  }
  8% {
    transform: rotate(35deg) translateX(1px);
    animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
  }
  20% {
    transform: rotate(-22deg) translateX(-1px);
    animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
  }
  35% {
    transform: rotate(15deg) translateX(1px);
    animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
  }
  50% {
    transform: rotate(-9deg);
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  65% {
    transform: rotate(5deg);
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  78% {
    transform: rotate(-3deg);
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  90% {
    transform: rotate(1deg);
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  100% {
    transform: rotate(0deg);
  }
}
@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes fa-spin-snap {
  0% {
    transform: rotate(0deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  12% {
    transform: rotate(60deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  16.67% {
    transform: rotate(60deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  28.67% {
    transform: rotate(120deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  33.33% {
    transform: rotate(120deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  45.33% {
    transform: rotate(180deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: rotate(180deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  62% {
    transform: rotate(240deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  66.67% {
    transform: rotate(240deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  78.67% {
    transform: rotate(300deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  83.33% {
    transform: rotate(300deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  95.33% {
    transform: rotate(360deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes fa-spin-snap-4 {
  0% {
    transform: rotate(0deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  15% {
    transform: rotate(90deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  25% {
    transform: rotate(90deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  40% {
    transform: rotate(180deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: rotate(180deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  65% {
    transform: rotate(270deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  75% {
    transform: rotate(270deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  90% {
    transform: rotate(360deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes fa-spin-snap-8 {
  0% {
    transform: rotate(0deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  9% {
    transform: rotate(45deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  12.5% {
    transform: rotate(45deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  21.5% {
    transform: rotate(90deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  25% {
    transform: rotate(90deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  34% {
    transform: rotate(135deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  37.5% {
    transform: rotate(135deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  46.5% {
    transform: rotate(180deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: rotate(180deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  59% {
    transform: rotate(225deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  62.5% {
    transform: rotate(225deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  71.5% {
    transform: rotate(270deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  75% {
    transform: rotate(270deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  84% {
    transform: rotate(315deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  87.5% {
    transform: rotate(315deg);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
  96.5% {
    transform: rotate(360deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes fa-buzz {
  0% {
    transform: translateX(0) rotate(0deg);
    animation-timing-function: cubic-bezier(0.1, 0, 0.9, 1);
  }
  5% {
    transform: translateX(var(--fa-buzz-distance, 4px)) rotate(0.5deg);
  }
  10% {
    transform: translateX(calc(-1 * var(--fa-buzz-distance, 4px))) rotate(-0.5deg);
  }
  15% {
    transform: translateX(var(--fa-buzz-distance, 4px)) rotate(0.3deg);
  }
  20% {
    transform: translateX(calc(-1 * var(--fa-buzz-distance, 4px))) rotate(-0.3deg);
  }
  25% {
    transform: translateX(calc(var(--fa-buzz-distance, 4px) * 0.7)) rotate(0.2deg);
  }
  30% {
    transform: translateX(calc(-1 * var(--fa-buzz-distance, 4px) * 0.7)) rotate(-0.2deg);
  }
  35% {
    transform: translateX(calc(var(--fa-buzz-distance, 4px) * 0.4)) rotate(0.1deg);
  }
  40% {
    transform: translateX(0) rotate(0deg);
  }
  100% {
    transform: translateX(0) rotate(0deg);
  }
}
@keyframes fa-wag {
  0% {
    transform: rotate(0deg);
    animation-timing-function: cubic-bezier(0.2, 0, 0.6, 1);
  }
  12% {
    transform: rotate(var(--fa-wag-angle, 12deg));
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  24% {
    transform: rotate(2deg);
    animation-timing-function: cubic-bezier(0.2, 0, 0.6, 1);
  }
  36% {
    transform: rotate(calc(var(--fa-wag-angle, 12deg) * 0.85));
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  48% {
    transform: rotate(1deg);
    animation-timing-function: cubic-bezier(0.2, 0, 0.6, 1);
  }
  58% {
    transform: rotate(calc(var(--fa-wag-angle, 12deg) * 0.6));
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  68% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
@keyframes fa-float {
  0% {
    transform: translateY(0) translateX(0) rotate(0deg) scale(var(--fa-float-squash-x, 1.02), var(--fa-float-squash-y, 0.98));
    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
  }
  15% {
    transform: translateY(calc(-0.4 * var(--fa-float-height, 6px))) translateX(var(--fa-float-drift, 1px)) rotate(var(--fa-float-tilt, 1deg)) scale(1, 1);
    animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
  }
  35% {
    transform: translateY(calc(-1 * var(--fa-float-height, 6px))) translateX(0) rotate(0deg) scale(var(--fa-float-stretch-x, 0.98), var(--fa-float-stretch-y, 1.03));
    animation-timing-function: cubic-bezier(0.5, 0, 0.5, 0);
  }
  50% {
    transform: translateY(calc(-0.92 * var(--fa-float-height, 6px))) translateX(calc(-0.5 * var(--fa-float-drift, 1px))) rotate(calc(-0.5 * var(--fa-float-tilt, 1deg))) scale(0.995, 1.01);
    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 0.33);
  }
  70% {
    transform: translateY(calc(-0.3 * var(--fa-float-height, 6px))) translateX(calc(-1 * var(--fa-float-drift, 1px))) rotate(calc(-1 * var(--fa-float-tilt, 1deg))) scale(1, 1);
    animation-timing-function: cubic-bezier(0.33, 0.66, 0.66, 1);
  }
  90% {
    transform: translateY(calc(0.05 * var(--fa-float-height, 6px))) translateX(0) rotate(0deg) scale(var(--fa-float-squash-x, 1.02), var(--fa-float-squash-y, 0.98));
    animation-timing-function: cubic-bezier(0.33, 0, 0.66, 1);
  }
  100% {
    transform: translateY(0) translateX(0) rotate(0deg) scale(var(--fa-float-squash-x, 1.02), var(--fa-float-squash-y, 0.98));
  }
}
@keyframes fa-swing {
  0% {
    transform: rotate(0deg);
    animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1);
  }
  8% {
    transform: rotate(var(--fa-swing-angle, 22deg));
    animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
  }
  18% {
    transform: rotate(calc(-1 * var(--fa-swing-angle, 22deg) * 0.85));
    animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
  }
  28% {
    transform: rotate(calc(var(--fa-swing-angle, 22deg) * 0.65));
    animation-timing-function: cubic-bezier(0.35, 0, 0.65, 1);
  }
  38% {
    transform: rotate(calc(-1 * var(--fa-swing-angle, 22deg) * 0.45));
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  48% {
    transform: rotate(calc(var(--fa-swing-angle, 22deg) * 0.25));
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  56% {
    transform: rotate(calc(-1 * var(--fa-swing-angle, 22deg) * 0.1));
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  64% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
@keyframes fa-jello {
  0% {
    transform: scale(1, 1);
    animation-timing-function: cubic-bezier(0.2, 0, 0.8, 1);
  }
  12% {
    transform: scale(var(--fa-jello-scale-x, 1.15), calc(2 - var(--fa-jello-scale-x, 1.15)));
    animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
  }
  24% {
    transform: scale(calc(2 - var(--fa-jello-scale-y, 1.12)), var(--fa-jello-scale-y, 1.12));
    animation-timing-function: cubic-bezier(0.3, 0, 0.7, 1);
  }
  36% {
    transform: scale(calc(1 + (var(--fa-jello-scale-x, 1.15) - 1) * 0.5), calc(2 - (1 + (var(--fa-jello-scale-x, 1.15) - 1) * 0.5)));
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  48% {
    transform: scale(calc(2 - (1 + (var(--fa-jello-scale-y, 1.12) - 1) * 0.3)), calc(1 + (var(--fa-jello-scale-y, 1.12) - 1) * 0.3));
    animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);
  }
  58% {
    transform: scale(1.02, 0.98);
    animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  68% {
    transform: scale(1, 1);
  }
  100% {
    transform: scale(1, 1);
  }
}
.fa-rotate-90 {
  transform: rotate(90deg);
}

.fa-rotate-180 {
  transform: rotate(180deg);
}

.fa-rotate-270 {
  transform: rotate(270deg);
}

.fa-flip-horizontal {
  transform: scale(-1, 1);
}

.fa-flip-vertical {
  transform: scale(1, -1);
}

.fa-flip-both,
.fa-flip-horizontal.fa-flip-vertical {
  transform: scale(-1, -1);
}

.fa-rotate-by {
  transform: rotate(var(--fa-rotate-angle, 0));
}

.svg-inline--fa .fa-primary {
  fill: var(--fa-primary-color, currentColor);
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa .fa-secondary {
  fill: var(--fa-secondary-color, currentColor);
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-primary {
  opacity: var(--fa-secondary-opacity, 0.4);
}

.svg-inline--fa.fa-swap-opacity .fa-secondary {
  opacity: var(--fa-primary-opacity, 1);
}

.svg-inline--fa mask .fa-primary,
.svg-inline--fa mask .fa-secondary {
  fill: black;
}

.svg-inline--fa.fa-inverse {
  fill: var(--fa-inverse, #fff);
}

.fa-stack {
  display: inline-block;
  height: 2em;
  line-height: 2em;
  position: relative;
  vertical-align: middle;
  width: 2.5em;
}

.fa-inverse {
  color: var(--fa-inverse, #fff);
}

.svg-inline--fa.fa-stack-1x {
  --fa-width: 1.25em;
  height: 1em;
  width: var(--fa-width);
}
.svg-inline--fa.fa-stack-2x {
  --fa-width: 2.5em;
  height: 2em;
  width: var(--fa-width);
}

.fa-stack-1x,
.fa-stack-2x {
  inset: 0;
  margin: auto;
  position: absolute;
  z-index: var(--fa-stack-z-index, auto);
}`;function ct(){var a=nt,e=tt,n=v.cssPrefix,t=v.replacementClass,r=Yo;if(n!==a||t!==e){var o=new RegExp("\\.".concat(a,"\\-"),"g"),i=new RegExp("\\--".concat(a,"\\-"),"g"),s=new RegExp("\\.".concat(e),"g");r=r.replace(o,".".concat(n,"-")).replace(i,"--".concat(n,"-")).replace(s,".".concat(t))}return r}var Ve=!1;function ee(){v.autoAddCss&&!Ve&&(Ro(ct()),Ve=!0)}var Bo={mixout:function(){return{dom:{css:ct,insertCss:ee}}},hooks:function(){return{beforeDOMElementCreation:function(){ee()},beforeI2svg:function(){ee()}}}},H=Q||{};H[X]||(H[X]={});H[X].styles||(H[X].styles={});H[X].hooks||(H[X].hooks={});H[X].shims||(H[X].shims=[]);var $=H[X],ut=[],dt=function(){j.removeEventListener("DOMContentLoaded",dt),Xa=1,ut.map(function(e){return e()})},Xa=!1;G&&(Xa=(j.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(j.readyState),Xa||j.addEventListener("DOMContentLoaded",dt));function Xo(a){G&&(Xa?setTimeout(a,0):ut.push(a))}function Fa(a){var e=a.tag,n=a.attributes,t=n===void 0?{}:n,r=a.children,o=r===void 0?[]:r;return typeof a=="string"?ft(a):"<".concat(e," ").concat(Do(t),">").concat(o.map(Fa).join(""),"</").concat(e,">")}function qe(a,e,n){if(a&&a[e]&&a[e][n])return{prefix:e,iconName:n,icon:a[e][n]}}var ne=function(e,n,t,r){var o=Object.keys(e),i=o.length,s=n,l,c,m;for(t===void 0?(l=1,m=e[o[0]]):(l=0,m=t);l<i;l++)c=o[l],m=s(m,e[c],c,e);return m};function mt(a){return D(a).length!==1?null:a.codePointAt(0).toString(16)}function Ke(a){return Object.keys(a).reduce(function(e,n){var t=a[n],r=!!t.icon;return r?e[t.iconName]=t.icon:e[n]=t,e},{})}function de(a,e){var n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{},t=n.skipHooks,r=t===void 0?!1:t,o=Ke(e);typeof $.hooks.addPack=="function"&&!r?$.hooks.addPack(a,Ke(e)):$.styles[a]=d(d({},$.styles[a]||{}),o),a==="fas"&&de("fa",e)}var Pa=$.styles,Ho=$.shims,gt=Object.keys(ze),Go=gt.reduce(function(a,e){return a[e]=Object.keys(ze[e]),a},{}),Ee=null,pt={},ht={},vt={},bt={},yt={};function Vo(a){return~Oo.indexOf(a)}function qo(a,e){var n=e.split("-"),t=n[0],r=n.slice(1).join("-");return t===a&&r!==""&&!Vo(r)?r:null}var xt=function(){var e=function(o){return ne(Pa,function(i,s,l){return i[l]=ne(s,o,{}),i},{})};pt=e(function(r,o,i){if(o[3]&&(r[o[3]]=i),o[2]){var s=o[2].filter(function(l){return typeof l=="number"});s.forEach(function(l){r[l.toString(16)]=i})}return r}),ht=e(function(r,o,i){if(r[i]=i,o[2]){var s=o[2].filter(function(l){return typeof l=="string"});s.forEach(function(l){r[l]=i})}return r}),yt=e(function(r,o,i){var s=o[2];return r[i]=i,s.forEach(function(l){r[l]=i}),r});var n="far"in Pa||v.autoFetchSvg,t=ne(Ho,function(r,o){var i=o[0],s=o[1],l=o[2];return s==="far"&&!n&&(s="fas"),typeof i=="string"&&(r.names[i]={prefix:s,iconName:l}),typeof i=="number"&&(r.unicodes[i.toString(16)]={prefix:s,iconName:l}),r},{names:{},unicodes:{}});vt=t.names,bt=t.unicodes,Ee=qa(v.styleDefault,{family:v.familyDefault})};No(function(a){Ee=qa(a.styleDefault,{family:v.familyDefault})});xt();function Fe(a,e){return(pt[a]||{})[e]}function Ko(a,e){return(ht[a]||{})[e]}function na(a,e){return(yt[a]||{})[e]}function St(a){return vt[a]||{prefix:null,iconName:null}}function Jo(a){var e=bt[a],n=Fe("fas",a);return e||(n?{prefix:"fas",iconName:n}:null)||{prefix:null,iconName:null}}function Z(){return Ee}var wt=function(){return{prefix:null,iconName:null,rest:[]}};function Qo(a){var e=E,n=gt.reduce(function(t,r){return t[r]="".concat(v.cssPrefix,"-").concat(r),t},{});return Qn.forEach(function(t){(a.includes(n[t])||a.some(function(r){return Go[t].includes(r)}))&&(e=t)}),e}function qa(a){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=e.family,t=n===void 0?E:n,r=Po[t][a];if(t===Ca&&!a)return"fad";var o=He[t][a]||He[t][r],i=a in $.styles?a:null,s=o||i||null;return s}function Zo(a){var e=[],n=null;return a.forEach(function(t){var r=qo(v.cssPrefix,t);r?n=r:t&&e.push(t)}),{iconName:n,rest:e}}function Je(a){return a.sort().filter(function(e,n,t){return t.indexOf(e)===n})}var Qe=at.concat(Zn);function Ka(a){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=e.skipLookups,t=n===void 0?!1:n,r=null,o=Je(a.filter(function(g){return Qe.includes(g)})),i=Je(a.filter(function(g){return!Qe.includes(g)})),s=o.filter(function(g){return r=g,!Cn.includes(g)}),l=Ga(s,1),c=l[0],m=c===void 0?null:c,u=Qo(o),p=d(d({},Zo(i)),{},{prefix:qa(m,{family:u})});return d(d(d({},p),ts({values:a,family:u,styles:Pa,config:v,canonical:p,givenPrefix:r})),as(t,r,p))}function as(a,e,n){var t=n.prefix,r=n.iconName;if(a||!t||!r)return{prefix:t,iconName:r};var o=e==="fa"?St(r):{},i=na(t,r);return r=o.iconName||i||r,t=o.prefix||t,t==="far"&&!Pa.far&&Pa.fas&&!v.autoFetchSvg&&(t="fas"),{prefix:t,iconName:r}}var es=Qn.filter(function(a){return a!==E||a!==Ca}),ns=Object.keys(oe).filter(function(a){return a!==E}).map(function(a){return Object.keys(oe[a])}).flat();function ts(a){var e=a.values,n=a.family,t=a.canonical,r=a.givenPrefix,o=r===void 0?"":r,i=a.styles,s=i===void 0?{}:i,l=a.config,c=l===void 0?{}:l,m=n===Ca,u=e.includes("fa-duotone")||e.includes("fad"),p=c.familyDefault==="duotone",g=t.prefix==="fad"||t.prefix==="fa-duotone";if(!m&&(u||p||g)&&(t.prefix="fad"),(e.includes("fa-brands")||e.includes("fab"))&&(t.prefix="fab"),!t.prefix&&es.includes(n)){var y=Object.keys(s).find(function(h){return ns.includes(h)});if(y||c.autoFetchSvg){var x=si.get(n).defaultShortPrefixId;t.prefix=x,t.iconName=na(t.prefix,t.iconName)||t.iconName}}return(t.prefix==="fa"||o==="fa")&&(t.prefix=Z()||"fas"),t}var rs=(function(){function a(){kr(this,a),this.definitions={}}return jr(a,[{key:"add",value:function(){for(var n=this,t=arguments.length,r=new Array(t),o=0;o<t;o++)r[o]=arguments[o];var i=r.reduce(this._pullDefinitions,{});Object.keys(i).forEach(function(s){n.definitions[s]=d(d({},n.definitions[s]||{}),i[s]),de(s,i[s]);var l=ze[E][s];l&&de(l,i[s]),xt()})}},{key:"reset",value:function(){this.definitions={}}},{key:"_pullDefinitions",value:function(n,t){var r=t.prefix&&t.iconName&&t.icon?{0:t}:t;return Object.keys(r).map(function(o){var i=r[o],s=i.prefix,l=i.iconName,c=i.icon,m=c[2];n[s]||(n[s]={}),m.length>0&&m.forEach(function(u){typeof u=="string"&&(n[s][u]=c)}),n[s][l]=c}),n}}])})(),Ze=[],ga={},pa={},is=Object.keys(pa);function os(a,e){var n=e.mixoutsTo;return Ze=a,ga={},Object.keys(pa).forEach(function(t){is.indexOf(t)===-1&&delete pa[t]}),Ze.forEach(function(t){var r=t.mixout?t.mixout():{};if(Object.keys(r).forEach(function(i){typeof r[i]=="function"&&(n[i]=r[i]),Ba(r[i])==="object"&&Object.keys(r[i]).forEach(function(s){n[i]||(n[i]={}),n[i][s]=r[i][s]})}),t.hooks){var o=t.hooks();Object.keys(o).forEach(function(i){ga[i]||(ga[i]=[]),ga[i].push(o[i])})}t.provides&&t.provides(pa)}),n}function me(a,e){for(var n=arguments.length,t=new Array(n>2?n-2:0),r=2;r<n;r++)t[r-2]=arguments[r];var o=ga[a]||[];return o.forEach(function(i){e=i.apply(null,[e].concat(t))}),e}function ra(a){for(var e=arguments.length,n=new Array(e>1?e-1:0),t=1;t<e;t++)n[t-1]=arguments[t];var r=ga[a]||[];r.forEach(function(o){o.apply(null,n)})}function aa(){var a=arguments[0],e=Array.prototype.slice.call(arguments,1);return pa[a]?pa[a].apply(null,e):void 0}function ge(a){a.prefix==="fa"&&(a.prefix="fas");var e=a.iconName,n=a.prefix||Z();if(e)return e=na(n,e)||e,qe(kt.definitions,n,e)||qe($.styles,n,e)}var kt=new rs,ss=function(){v.autoReplaceSvg=!1,v.observeMutations=!1,ra("noAuto")},ls={i2svg:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};return G?(ra("beforeI2svg",e),aa("pseudoElements2svg",e),aa("i2svg",e)):Promise.reject(new Error("Operation requires a DOM of some kind."))},watch:function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},n=e.autoReplaceSvgRoot;v.autoReplaceSvg===!1&&(v.autoReplaceSvg=!0),v.observeMutations=!0,Xo(function(){cs({autoReplaceSvgRoot:n}),ra("watch",e)})}},fs={icon:function(e){if(e===null)return null;if(Ba(e)==="object"&&e.prefix&&e.iconName)return{prefix:e.prefix,iconName:na(e.prefix,e.iconName)||e.iconName};if(Array.isArray(e)&&e.length===2){var n=e[1].indexOf("fa-")===0?e[1].slice(3):e[1],t=qa(e[0]);return{prefix:t,iconName:na(t,n)||n}}if(typeof e=="string"&&(e.indexOf("".concat(v.cssPrefix,"-"))>-1||e.match(Co))){var r=Ka(e.split(" "),{skipLookups:!0});return{prefix:r.prefix||Z(),iconName:na(r.prefix,r.iconName)||r.iconName}}if(typeof e=="string"){var o=Z();return{prefix:o,iconName:na(o,e)||e}}}},_={noAuto:ss,config:v,dom:ls,parse:fs,library:kt,findIconDefinition:ge,toHtml:Fa},cs=function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{},n=e.autoReplaceSvgRoot,t=n===void 0?j:n;(Object.keys($.styles).length>0||v.autoFetchSvg)&&G&&v.autoReplaceSvg&&_.dom.i2svg({node:t})};function Ja(a,e){return Object.defineProperty(a,"abstract",{get:e}),Object.defineProperty(a,"html",{get:function(){return a.abstract.map(function(t){return Fa(t)})}}),Object.defineProperty(a,"node",{get:function(){if(G){var t=j.createElement("div");return t.innerHTML=a.html,t.children}}}),a}function us(a){var e=a.children,n=a.main,t=a.mask,r=a.attributes,o=a.styles,i=a.transform;if(Ce(i)&&n.found&&!t.found){var s=n.width,l=n.height,c={x:s/l/2,y:.5};r.style=Va(d(d({},o),{},{"transform-origin":"".concat(c.x+i.x/16,"em ").concat(c.y+i.y/16,"em")}))}return[{tag:"svg",attributes:r,children:e}]}function ds(a){var e=a.prefix,n=a.iconName,t=a.children,r=a.attributes,o=a.symbol,i=o===!0?"".concat(e,"-").concat(v.cssPrefix,"-").concat(n):o;return[{tag:"svg",attributes:{style:"display: none;"},children:[{tag:"symbol",attributes:d(d({},r),{},{id:i}),children:t}]}]}function ms(a){var e=["aria-label","aria-labelledby","title","role"];return e.some(function(n){return n in a})}function Me(a){var e=a.icons,n=e.main,t=e.mask,r=a.prefix,o=a.iconName,i=a.transform,s=a.symbol,l=a.maskId,c=a.extra,m=a.watchable,u=m===void 0?!1:m,p=t.found?t:n,g=p.width,y=p.height,x=[v.replacementClass,o?"".concat(v.cssPrefix,"-").concat(o):""].filter(function(I){return c.classes.indexOf(I)===-1}).filter(function(I){return I!==""||!!I}).concat(c.classes).join(" "),h={children:[],attributes:d(d({},c.attributes),{},{"data-prefix":r,"data-icon":o,class:x,role:c.attributes.role||"img",viewBox:"0 0 ".concat(g," ").concat(y)})};!ms(c.attributes)&&!c.attributes["aria-hidden"]&&(h.attributes["aria-hidden"]="true"),u&&(h.attributes[ta]="");var S=d(d({},h),{},{prefix:r,iconName:o,main:n,mask:t,maskId:l,transform:i,symbol:s,styles:d({},c.styles)}),A=t.found&&n.found?aa("generateAbstractMask",S)||{children:[],attributes:{}}:aa("generateAbstractIcon",S)||{children:[],attributes:{}},k=A.children,F=A.attributes;return S.children=k,S.attributes=F,s?ds(S):us(S)}function an(a){var e=a.content,n=a.width,t=a.height,r=a.transform,o=a.extra,i=a.watchable,s=i===void 0?!1:i,l=d(d({},o.attributes),{},{class:o.classes.join(" ")});s&&(l[ta]="");var c=d({},o.styles);Ce(r)&&(c.transform=Uo({transform:r,width:n,height:t}),c["-webkit-transform"]=c.transform);var m=Va(c);m.length>0&&(l.style=m);var u=[];return u.push({tag:"span",attributes:l,children:[e]}),u}function gs(a){var e=a.content,n=a.extra,t=d(d({},n.attributes),{},{class:n.classes.join(" ")}),r=Va(n.styles);r.length>0&&(t.style=r);var o=[];return o.push({tag:"span",attributes:t,children:[e]}),o}var te=$.styles;function pe(a){var e=a[0],n=a[1],t=a.slice(4),r=Ga(t,1),o=r[0],i=null;return Array.isArray(o)?i={tag:"g",attributes:{class:"".concat(v.cssPrefix,"-").concat(ae.GROUP)},children:[{tag:"path",attributes:{class:"".concat(v.cssPrefix,"-").concat(ae.SECONDARY),fill:"currentColor",d:o[0]}},{tag:"path",attributes:{class:"".concat(v.cssPrefix,"-").concat(ae.PRIMARY),fill:"currentColor",d:o[1]}}]}:i={tag:"path",attributes:{fill:"currentColor",d:o}},{found:!0,width:e,height:n,icon:i}}var ps={found:!1,width:512,height:512};function hs(a,e){!it&&!v.showMissingIcons&&a&&console.error('Icon with name "'.concat(a,'" and prefix "').concat(e,'" is missing.'))}function he(a,e){var n=e;return e==="fa"&&v.styleDefault!==null&&(e=Z()),new Promise(function(t,r){if(n==="fa"){var o=St(a)||{};a=o.iconName||a,e=o.prefix||e}if(a&&e&&te[e]&&te[e][a]){var i=te[e][a];return t(pe(i))}hs(a,e),t(d(d({},ps),{},{icon:v.showMissingIcons&&a?aa("missingIconAbstract")||{}:{}}))})}var en=function(){},ve=v.measurePerformance&&La&&La.mark&&La.measure?La:{mark:en,measure:en},ka='FA "7.3.1"',vs=function(e){return ve.mark("".concat(ka," ").concat(e," begins")),function(){return At(e)}},At=function(e){ve.mark("".concat(ka," ").concat(e," ends")),ve.measure("".concat(ka," ").concat(e),"".concat(ka," ").concat(e," begins"),"".concat(ka," ").concat(e," ends"))},Oe={begin:vs,end:At},Da=function(){};function nn(a){var e=a.getAttribute?a.getAttribute(ta):null;return typeof e=="string"}function bs(a){var e=a.getAttribute?a.getAttribute(je):null,n=a.getAttribute?a.getAttribute(Ie):null;return e&&n}function ys(a){return a&&a.classList&&a.classList.contains&&a.classList.contains(v.replacementClass)}function xs(){if(v.autoReplaceSvg===!0)return Wa.replace;var a=Wa[v.autoReplaceSvg];return a||Wa.replace}function Ss(a){return j.createElementNS("http://www.w3.org/2000/svg",a)}function ws(a){return j.createElement(a)}function jt(a){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},n=e.ceFn,t=n===void 0?a.tag==="svg"?Ss:ws:n;if(typeof a=="string")return j.createTextNode(a);var r=t(a.tag);Object.keys(a.attributes||[]).forEach(function(i){r.setAttribute(i,a.attributes[i])});var o=a.children||[];return o.forEach(function(i){r.appendChild(jt(i,{ceFn:t}))}),r}function ks(a){var e=" ".concat(a.outerHTML," ");return e="".concat(e,"Font Awesome fontawesome.com "),e}var Wa={replace:function(e){var n=e[0];if(n.parentNode)if(e[1].forEach(function(r){n.parentNode.insertBefore(jt(r),n)}),n.getAttribute(ta)===null&&v.keepOriginalSource){var t=j.createComment(ks(n));n.parentNode.replaceChild(t,n)}else n.remove()},nest:function(e){var n=e[0],t=e[1];if(~Pe(n).indexOf(v.replacementClass))return Wa.replace(e);var r=new RegExp("".concat(v.cssPrefix,"-.*"));if(delete t[0].attributes.id,t[0].attributes.class){var o=t[0].attributes.class.split(" ").reduce(function(s,l){return l===v.replacementClass||l.match(r)?s.toSvg.push(l):s.toNode.push(l),s},{toNode:[],toSvg:[]});t[0].attributes.class=o.toSvg.join(" "),o.toNode.length===0?n.removeAttribute("class"):n.setAttribute("class",o.toNode.join(" "))}var i=t.map(function(s){return Fa(s)}).join(`
`);n.setAttribute(ta,""),n.innerHTML=i}};function tn(a){a()}function It(a,e){var n=typeof e=="function"?e:Da;if(a.length===0)n();else{var t=tn;v.mutateApproach===Io&&(t=Q.requestAnimationFrame||tn),t(function(){var r=xs(),o=Oe.begin("mutate");a.map(r),o(),n()})}}var Le=!1;function zt(){Le=!0}function be(){Le=!1}var Ha=null;function rn(a){if(Ue&&v.observeMutations){var e=a.treeCallback,n=e===void 0?Da:e,t=a.nodeCallback,r=t===void 0?Da:t,o=a.pseudoElementsCallback,i=o===void 0?Da:o,s=a.observeMutationsRoot,l=s===void 0?j:s;Ha=new Ue(function(c){if(!Le){var m=Z();ya(c).forEach(function(u){if(u.type==="childList"&&u.addedNodes.length>0&&!nn(u.addedNodes[0])&&(v.searchPseudoElements&&i(u.target),n(u.target)),u.type==="attributes"&&u.target.parentNode&&v.searchPseudoElements&&i([u.target],!0),u.type==="attributes"&&nn(u.target)&&~Mo.indexOf(u.attributeName))if(u.attributeName==="class"&&bs(u.target)){var p=Ka(Pe(u.target)),g=p.prefix,y=p.iconName;u.target.setAttribute(je,g||m),y&&u.target.setAttribute(Ie,y)}else ys(u.target)&&r(u.target)})}}),G&&Ha.observe(l,{childList:!0,attributes:!0,characterData:!0,subtree:!0})}}function As(){Ha&&Ha.disconnect()}function js(a){var e=a.getAttribute("style"),n=[];return e&&(n=e.split(";").reduce(function(t,r){var o=r.split(":"),i=o[0],s=o.slice(1);return i&&s.length>0&&(t[i]=s.join(":").trim()),t},{})),n}function Is(a){var e=a.getAttribute("data-prefix"),n=a.getAttribute("data-icon"),t=a.innerText!==void 0?a.innerText.trim():"",r=Ka(Pe(a));return r.prefix||(r.prefix=Z()),e&&n&&(r.prefix=e,r.iconName=n),r.iconName&&r.prefix||(r.prefix&&t.length>0&&(r.iconName=Ko(r.prefix,a.innerText)||Fe(r.prefix,mt(a.innerText))),!r.iconName&&v.autoFetchSvg&&a.firstChild&&a.firstChild.nodeType===Node.TEXT_NODE&&(r.iconName=a.firstChild.data)),r}function zs(a){var e=ya(a.attributes).reduce(function(n,t){return n.name!=="class"&&n.name!=="style"&&(n[t.name]=t.value),n},{});return e}function Ps(){return{iconName:null,prefix:null,transform:U,symbol:!1,mask:{iconName:null,prefix:null,rest:[]},maskId:null,extra:{classes:[],styles:{},attributes:{}}}}function on(a){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{styleParser:!0},n=Is(a),t=n.iconName,r=n.prefix,o=n.rest,i=zs(a),s=me("parseNodeAttributes",{},a),l=e.styleParser?js(a):[];return d({iconName:t,prefix:r,transform:U,mask:{iconName:null,prefix:null,rest:[]},maskId:null,symbol:!1,extra:{classes:o,styles:l,attributes:i}},s)}var Cs=$.styles;function Pt(a){var e=v.autoReplaceSvg==="nest"?on(a,{styleParser:!1}):on(a);return~e.extra.classes.indexOf(st)?aa("generateLayersText",a,e):aa("generateSvgReplacementMutation",a,e)}function Es(){return[].concat(D(Zn),D(at))}function sn(a){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;if(!G)return Promise.resolve();var n=j.documentElement.classList,t=function(u){return n.add("".concat(Xe,"-").concat(u))},r=function(u){return n.remove("".concat(Xe,"-").concat(u))},o=v.autoFetchSvg?Es():Cn.concat(Object.keys(Cs));o.includes("fa")||o.push("fa");var i=[".".concat(st,":not([").concat(ta,"])")].concat(o.map(function(m){return".".concat(m,":not([").concat(ta,"])")})).join(", ");if(i.length===0)return Promise.resolve();var s=[];try{s=ya(a.querySelectorAll(i))}catch{}if(s.length>0)t("pending"),r("complete");else return Promise.resolve();var l=Oe.begin("onTree"),c=s.reduce(function(m,u){try{var p=Pt(u);p&&m.push(p)}catch(g){it||g.name==="MissingIcon"&&console.error(g)}return m},[]);return new Promise(function(m,u){Promise.all(c).then(function(p){It(p,function(){t("active"),t("complete"),r("pending"),typeof e=="function"&&e(),l(),m()})}).catch(function(p){l(),u(p)})})}function Fs(a){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:null;Pt(a).then(function(n){n&&It([n],e)})}function Ms(a){return function(e){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},t=(e||{}).icon?e:ge(e||{}),r=n.mask;return r&&(r=(r||{}).icon?r:ge(r||{})),a(t,d(d({},n),{},{mask:r}))}}var Os=function(e){var n=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},t=n.transform,r=t===void 0?U:t,o=n.symbol,i=o===void 0?!1:o,s=n.mask,l=s===void 0?null:s,c=n.maskId,m=c===void 0?null:c,u=n.classes,p=u===void 0?[]:u,g=n.attributes,y=g===void 0?{}:g,x=n.styles,h=x===void 0?{}:x;if(e){var S=e.prefix,A=e.iconName,k=e.icon;return Ja(d({type:"icon"},e),function(){return ra("beforeDOMElementCreation",{iconDefinition:e,params:n}),Me({icons:{main:pe(k),mask:l?pe(l.icon):{found:!1,width:null,height:null,icon:{}}},prefix:S,iconName:A,transform:d(d({},U),r),symbol:i,maskId:m,extra:{attributes:y,styles:h,classes:p}})})}},Ls={mixout:function(){return{icon:Ms(Os)}},hooks:function(){return{mutationObserverCallbacks:function(n){return n.treeCallback=sn,n.nodeCallback=Fs,n}}},provides:function(e){e.i2svg=function(n){var t=n.node,r=t===void 0?j:t,o=n.callback,i=o===void 0?function(){}:o;return sn(r,i)},e.generateSvgReplacementMutation=function(n,t){var r=t.iconName,o=t.prefix,i=t.transform,s=t.symbol,l=t.mask,c=t.maskId,m=t.extra;return new Promise(function(u,p){Promise.all([he(r,o),l.iconName?he(l.iconName,l.prefix):Promise.resolve({found:!1,width:512,height:512,icon:{}})]).then(function(g){var y=Ga(g,2),x=y[0],h=y[1];u([n,Me({icons:{main:x,mask:h},prefix:o,iconName:r,transform:i,symbol:s,maskId:c,extra:m,watchable:!0})])}).catch(p)})},e.generateAbstractIcon=function(n){var t=n.children,r=n.attributes,o=n.main,i=n.transform,s=n.styles,l=Va(s);l.length>0&&(r.style=l);var c;return Ce(i)&&(c=aa("generateAbstractTransformGrouping",{main:o,transform:i,containerWidth:o.width,iconWidth:o.width})),t.push(c||o.icon),{children:t,attributes:r}}}},_s={mixout:function(){return{layer:function(n){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=t.classes,o=r===void 0?[]:r;return Ja({type:"layer"},function(){ra("beforeDOMElementCreation",{assembler:n,params:t});var i=[];return n(function(s){Array.isArray(s)?s.map(function(l){i=i.concat(l.abstract)}):i=i.concat(s.abstract)}),[{tag:"span",attributes:{class:["".concat(v.cssPrefix,"-layers")].concat(D(o)).join(" ")},children:i}]})}}}},Ts={mixout:function(){return{counter:function(n){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{};t.title;var r=t.classes,o=r===void 0?[]:r,i=t.attributes,s=i===void 0?{}:i,l=t.styles,c=l===void 0?{}:l;return Ja({type:"counter",content:n},function(){return ra("beforeDOMElementCreation",{content:n,params:t}),gs({content:n.toString(),extra:{attributes:s,styles:c,classes:["".concat(v.cssPrefix,"-layers-counter")].concat(D(o))}})})}}}},Ns={mixout:function(){return{text:function(n){var t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:{},r=t.transform,o=r===void 0?U:r,i=t.classes,s=i===void 0?[]:i,l=t.attributes,c=l===void 0?{}:l,m=t.styles,u=m===void 0?{}:m;return Ja({type:"text",content:n},function(){return ra("beforeDOMElementCreation",{content:n,params:t}),an({content:n,transform:d(d({},U),o),extra:{attributes:c,styles:u,classes:["".concat(v.cssPrefix,"-layers-text")].concat(D(s))}})})}}},provides:function(e){e.generateLayersText=function(n,t){var r=t.transform,o=t.extra,i=null,s=null;if(zn){var l=parseInt(getComputedStyle(n).fontSize,10),c=n.getBoundingClientRect();i=c.width/l,s=c.height/l}return Promise.resolve([n,an({content:n.innerHTML,width:i,height:s,transform:r,extra:o,watchable:!0})])}}},Ct=new RegExp('"',"ug"),ln=[1105920,1112319],fn=d(d(d(d({},{FontAwesome:{normal:"fas",400:"fas"}}),oi),Ao),pi),ye=Object.keys(fn).reduce(function(a,e){return a[e.toLowerCase()]=fn[e],a},{}),Rs=Object.keys(ye).reduce(function(a,e){var n=ye[e];return a[e]=n[900]||D(Object.entries(n))[0][1],a},{});function $s(a){var e=a.replace(Ct,"");return mt(D(e)[0]||"")}function Ds(a){var e=a.getPropertyValue("font-feature-settings").includes("ss01"),n=a.getPropertyValue("content"),t=n.replace(Ct,""),r=t.codePointAt(0),o=r>=ln[0]&&r<=ln[1],i=t.length===2?t[0]===t[1]:!1;return o||i||e}function Ws(a,e){var n=a.replace(/^['"]|['"]$/g,"").toLowerCase(),t=parseInt(e),r=isNaN(t)?"normal":t;return(ye[n]||{})[r]||Rs[n]}function cn(a,e){var n="".concat(jo).concat(e.replace(":","-"));return new Promise(function(t,r){if(a.getAttribute(n)!==null)return t();var o=ya(a.children),i=o.filter(function(W){return W.getAttribute(le)===e})[0],s=Q.getComputedStyle(a,e),l=s.getPropertyValue("font-family"),c=l.match(Eo),m=s.getPropertyValue("font-weight"),u=s.getPropertyValue("content");if(i&&!c)return a.removeChild(i),t();if(c&&u!=="none"&&u!==""){var p=s.getPropertyValue("content"),g=Ws(l,m),y=$s(p),x=c[0].startsWith("FontAwesome"),h=Ds(s),S=Fe(g,y),A=S;if(x){var k=Jo(y);k.iconName&&k.prefix&&(S=k.iconName,g=k.prefix)}if(S&&!h&&(!i||i.getAttribute(je)!==g||i.getAttribute(Ie)!==A)){a.setAttribute(n,A),i&&a.removeChild(i);var F=Ps(),I=F.extra;I.attributes[le]=e,he(S,g).then(function(W){var ea=Me(d(d({},F),{},{icons:{main:W,mask:wt()},prefix:g,iconName:A,extra:I,watchable:!0})),N=j.createElementNS("http://www.w3.org/2000/svg","svg");e==="::before"?a.insertBefore(N,a.firstChild):a.appendChild(N),N.outerHTML=ea.map(function(oa){return Fa(oa)}).join(`
`),a.removeAttribute(n),t()}).catch(r)}else t()}else t()})}function Us(a){return Promise.all([cn(a,"::before"),cn(a,"::after")])}function Ys(a){return a.parentNode!==document.head&&!~zo.indexOf(a.tagName.toUpperCase())&&!a.getAttribute(le)&&(!a.parentNode||a.parentNode.tagName!=="svg")}var Bs=function(e){return!!e&&rt.some(function(n){return e.includes(n)})},Xs=function(e){if(!e)return[];var n=new Set,t=e.split(/,(?![^()]*\))/).map(function(l){return l.trim()});t=t.flatMap(function(l){return l.includes("(")?l:l.split(",").map(function(c){return c.trim()})});var r=$a(t),o;try{for(r.s();!(o=r.n()).done;){var i=o.value;if(Bs(i)){var s=rt.reduce(function(l,c){return l.replace(c,"")},i);s!==""&&s!=="*"&&n.add(s)}}}catch(l){r.e(l)}finally{r.f()}return n};function un(a){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!1;if(G){var n;if(e)n=a;else if(v.searchPseudoElementsFullScan)n=a.querySelectorAll("*");else{var t=new Set,r=$a(document.styleSheets),o;try{for(r.s();!(o=r.n()).done;){var i=o.value;try{var s=$a(i.cssRules),l;try{for(s.s();!(l=s.n()).done;){var c=l.value,m=Xs(c.selectorText),u=$a(m),p;try{for(u.s();!(p=u.n()).done;){var g=p.value;t.add(g)}}catch(x){u.e(x)}finally{u.f()}}}catch(x){s.e(x)}finally{s.f()}}catch(x){v.searchPseudoElementsWarnings&&console.warn("Font Awesome: cannot parse stylesheet: ".concat(i.href," (").concat(x.message,`)
If it declares any Font Awesome CSS pseudo-elements, they will not be rendered as SVG icons. Add crossorigin="anonymous" to the <link>, enable searchPseudoElementsFullScan for slower but more thorough DOM parsing, or suppress this warning by setting searchPseudoElementsWarnings to false.`))}}}catch(x){r.e(x)}finally{r.f()}if(!t.size)return;var y=Array.from(t).join(", ");try{n=a.querySelectorAll(y)}catch{}}return new Promise(function(x,h){var S=ya(n).filter(Ys).map(Us),A=Oe.begin("searchPseudoElements");zt(),Promise.all(S).then(function(){A(),be(),x()}).catch(function(){A(),be(),h()})})}}var Hs={hooks:function(){return{mutationObserverCallbacks:function(n){return n.pseudoElementsCallback=un,n}}},provides:function(e){e.pseudoElements2svg=function(n){var t=n.node,r=t===void 0?j:t;v.searchPseudoElements&&un(r)}}},dn=!1,Gs={mixout:function(){return{dom:{unwatch:function(){zt(),dn=!0}}}},hooks:function(){return{bootstrap:function(){rn(me("mutationObserverCallbacks",{}))},noAuto:function(){As()},watch:function(n){var t=n.observeMutationsRoot;dn?be():rn(me("mutationObserverCallbacks",{observeMutationsRoot:t}))}}}},mn=function(e){var n={size:16,x:0,y:0,flipX:!1,flipY:!1,rotate:0};return e.toLowerCase().split(" ").reduce(function(t,r){var o=r.toLowerCase().split("-"),i=o[0],s=o.slice(1).join("-");if(i&&s==="h")return t.flipX=!0,t;if(i&&s==="v")return t.flipY=!0,t;if(s=parseFloat(s),isNaN(s))return t;switch(i){case"grow":t.size=t.size+s;break;case"shrink":t.size=t.size-s;break;case"left":t.x=t.x-s;break;case"right":t.x=t.x+s;break;case"up":t.y=t.y-s;break;case"down":t.y=t.y+s;break;case"rotate":t.rotate=t.rotate+s;break}return t},n)},Vs={mixout:function(){return{parse:{transform:function(n){return mn(n)}}}},hooks:function(){return{parseNodeAttributes:function(n,t){var r=t.getAttribute("data-fa-transform");return r&&(n.transform=mn(r)),n}}},provides:function(e){e.generateAbstractTransformGrouping=function(n){var t=n.main,r=n.transform,o=n.containerWidth,i=n.iconWidth,s={transform:"translate(".concat(o/2," 256)")},l="translate(".concat(r.x*32,", ").concat(r.y*32,") "),c="scale(".concat(r.size/16*(r.flipX?-1:1),", ").concat(r.size/16*(r.flipY?-1:1),") "),m="rotate(".concat(r.rotate," 0 0)"),u={transform:"".concat(l," ").concat(c," ").concat(m)},p={transform:"translate(".concat(i/2*-1," -256)")},g={outer:s,inner:u,path:p};return{tag:"g",attributes:d({},g.outer),children:[{tag:"g",attributes:d({},g.inner),children:[{tag:t.icon.tag,children:t.icon.children,attributes:d(d({},t.icon.attributes),g.path)}]}]}}}},re={x:0,y:0,width:"100%",height:"100%"};function gn(a){var e=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return a.attributes&&(a.attributes.fill||e)&&(a.attributes.fill="black"),a}function qs(a){return a.tag==="g"?a.children:[a]}var Ks={hooks:function(){return{parseNodeAttributes:function(n,t){var r=t.getAttribute("data-fa-mask"),o=r?Ka(r.split(" ").map(function(i){return i.trim()})):wt();return o.prefix||(o.prefix=Z()),n.mask=o,n.maskId=t.getAttribute("data-fa-mask-id"),n}}},provides:function(e){e.generateAbstractMask=function(n){var t=n.children,r=n.attributes,o=n.main,i=n.mask,s=n.maskId,l=n.transform,c=o.width,m=o.icon,u=i.width,p=i.icon,g=Wo({transform:l,containerWidth:u,iconWidth:c}),y={tag:"rect",attributes:d(d({},re),{},{fill:"white"})},x=m.children?{children:m.children.map(gn)}:{},h={tag:"g",attributes:d({},g.inner),children:[gn(d({tag:m.tag,attributes:d(d({},m.attributes),g.path)},x))]},S={tag:"g",attributes:d({},g.outer),children:[h]},A="mask-".concat(s||Ge()),k="clip-".concat(s||Ge()),F={tag:"mask",attributes:d(d({},re),{},{id:A,maskUnits:"userSpaceOnUse",maskContentUnits:"userSpaceOnUse"}),children:[y,S]},I={tag:"defs",children:[{tag:"clipPath",attributes:{id:k},children:qs(p)},F]};return t.push(I,{tag:"rect",attributes:d({fill:"currentColor","clip-path":"url(#".concat(k,")"),mask:"url(#".concat(A,")")},re)}),{children:t,attributes:r}}}},Js={provides:function(e){var n=!1;Q.matchMedia&&(n=Q.matchMedia("(prefers-reduced-motion: reduce)").matches),e.missingIconAbstract=function(){var t=[],r={fill:"currentColor"},o={attributeType:"XML",repeatCount:"indefinite",dur:"2s"};t.push({tag:"path",attributes:d(d({},r),{},{d:"M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z"})});var i=d(d({},o),{},{attributeName:"opacity"}),s={tag:"circle",attributes:d(d({},r),{},{cx:"256",cy:"364",r:"28"}),children:[]};return n||s.children.push({tag:"animate",attributes:d(d({},o),{},{attributeName:"r",values:"28;14;28;28;14;28;"})},{tag:"animate",attributes:d(d({},i),{},{values:"1;0;1;1;0;1;"})}),t.push(s),t.push({tag:"path",attributes:d(d({},r),{},{opacity:"1",d:"M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z"}),children:n?[]:[{tag:"animate",attributes:d(d({},i),{},{values:"1;0;0;0;0;1;"})}]}),n||t.push({tag:"path",attributes:d(d({},r),{},{opacity:"0",d:"M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z"}),children:[{tag:"animate",attributes:d(d({},i),{},{values:"0;0;1;1;0;0;"})}]}),{tag:"g",attributes:{class:"missing"},children:t}}}},Qs={hooks:function(){return{parseNodeAttributes:function(n,t){var r=t.getAttribute("data-fa-symbol"),o=r===null?!1:r===""?!0:r;return n.symbol=o,n}}}},Zs=[Bo,Ls,_s,Ts,Ns,Hs,Gs,Vs,Ks,Js,Qs];os(Zs,{mixoutsTo:_});_.noAuto;var va=_.config;_.library;_.dom;var Et=_.parse;_.findIconDefinition;_.toHtml;var al=_.icon;_.layer;_.text;_.counter;function el(a){return a=a-0,a===a}function Ft(a){return el(a)?a:(a=a.replace(/[_-]+(.)?/g,(e,n)=>n?n.toUpperCase():""),a.charAt(0).toLowerCase()+a.slice(1))}var nl=(a,e)=>xe.createElement("stop",{key:`${e}-${a.offset}`,offset:a.offset,stopColor:a.color,...a.opacity!==void 0&&{stopOpacity:a.opacity}});function tl(a){return a.charAt(0).toUpperCase()+a.slice(1)}var da=new Map,rl=1e3;function il(a){if(da.has(a))return da.get(a);const e={};let n=0;const t=a.length;for(;n<t;){const r=a.indexOf(";",n),o=r===-1?t:r,i=a.slice(n,o).trim();if(i){const s=i.indexOf(":");if(s>0){const l=i.slice(0,s).trim(),c=i.slice(s+1).trim();if(l&&c){const m=Ft(l);e[m.startsWith("webkit")?tl(m):m]=c}}}n=o+1}if(da.size===rl){const r=da.keys().next().value;r&&da.delete(r)}return da.set(a,e),e}function Mt(a,e,n={}){if(typeof e=="string")return e;const t=(e.children||[]).map(u=>{let p=u;return("fill"in n||n.gradientFill)&&u.tag==="path"&&"fill"in u.attributes&&(p={...u,attributes:{...u.attributes,fill:void 0}}),Mt(a,p)}),r=e.attributes||{},o={};for(const[u,p]of Object.entries(r))switch(!0){case u==="class":{o.className=p;break}case u==="style":{o.style=il(String(p));break}case u.startsWith("aria-"):case u.startsWith("data-"):{o[u.toLowerCase()]=p;break}default:o[Ft(u)]=p}const{style:i,role:s,"aria-label":l,gradientFill:c,...m}=n;if(i&&(o.style=o.style?{...o.style,...i}:i),s&&(o.role=s),l&&(o["aria-label"]=l,o["aria-hidden"]="false"),c){o.fill=`url(#${c.id})`;const{type:u,stops:p=[],...g}=c;t.unshift(a(u==="linear"?"linearGradient":"radialGradient",{...g,id:c.id},p.map(nl)))}return a(e.tag,{...o,...m},...t)}var ol=Mt.bind(null,xe.createElement),pn=(a,e)=>{const n=C.useId();return a||(e?n:void 0)},sl=class{constructor(a="react-fontawesome"){this.enabled=!1;let e=!1;try{e=typeof process<"u"&&!1}catch{}this.scope=a,this.enabled=e}log(...a){this.enabled&&console.log(`[${this.scope}]`,...a)}warn(...a){this.enabled&&console.warn(`[${this.scope}]`,...a)}error(...a){this.enabled&&console.error(`[${this.scope}]`,...a)}},ll="searchPseudoElementsFullScan"in va&&typeof va.searchPseudoElementsFullScan=="boolean"?"7.0.0":"6.0.0",fl=Number.parseInt(ll)>=7,cl=()=>fl,za="fa",P={beat:"fa-beat",fade:"fa-fade",beatFade:"fa-beat-fade",bounce:"fa-bounce",shake:"fa-shake",spin:"fa-spin",spinPulse:"fa-spin-pulse",spinReverse:"fa-spin-reverse",pulse:"fa-pulse",flip360:"fa-flip-360",buzz:"fa-buzz",float:"fa-float",jello:"fa-jello",spinSnap:"fa-spin-snap",spinSnap4:"fa-spin-snap-4",spinSnap8:"fa-spin-snap-8",swing:"fa-swing",wag:"fa-wag"},ul={left:"fa-pull-left",right:"fa-pull-right"},dl={90:"fa-rotate-90",180:"fa-rotate-180",270:"fa-rotate-270"},ml={"2xs":"fa-2xs",xs:"fa-xs",sm:"fa-sm",lg:"fa-lg",xl:"fa-xl","2xl":"fa-2xl","1x":"fa-1x","2x":"fa-2x","3x":"fa-3x","4x":"fa-4x","5x":"fa-5x","6x":"fa-6x","7x":"fa-7x","8x":"fa-8x","9x":"fa-9x","10x":"fa-10x"},R={border:"fa-border",fixedWidth:"fa-fw",flip:"fa-flip",flipHorizontal:"fa-flip-horizontal",flipVertical:"fa-flip-vertical",inverse:"fa-inverse",rotateBy:"fa-rotate-by",swapOpacity:"fa-swap-opacity",widthAuto:"fa-width-auto",canvasSquare:"fa-canvas-square",canvasRoomy:"fa-canvas-roomy"};function gl(a){const e=va.cssPrefix||va.familyPrefix||za;return e===za?a:a.replace(new RegExp(String.raw`(?<=^|\s)${za}-`,"g"),`${e}-`)}function pl(a){const{beat:e,fade:n,beatFade:t,bounce:r,shake:o,spin:i,spinPulse:s,spinReverse:l,pulse:c,fixedWidth:m,inverse:u,border:p,flip:g,size:y,rotation:x,pull:h,swapOpacity:S,rotateBy:A,widthAuto:k,canvasSquare:F,canvasRoomy:I,flip360:W,buzz:ea,float:N,jello:oa,spinSnap:Qa,spinSnap4:Za,spinSnap8:xa,swing:sa,wag:la,className:Ma}=a,w=[];return Ma&&w.push(...Ma.split(" ")),e&&w.push(P.beat),n&&w.push(P.fade),t&&w.push(P.beatFade),r&&w.push(P.bounce),o&&w.push(P.shake),i&&w.push(P.spin),l&&w.push(P.spinReverse),s&&w.push(P.spinPulse),c&&w.push(P.pulse),m&&w.push(R.fixedWidth),u&&w.push(R.inverse),p&&w.push(R.border),g===!0&&w.push(R.flip),(g==="horizontal"||g==="both")&&w.push(R.flipHorizontal),(g==="vertical"||g==="both")&&w.push(R.flipVertical),y!=null&&w.push(ml[y]),x!=null&&x!==0&&w.push(dl[x]),h!=null&&w.push(ul[h]),S&&w.push(R.swapOpacity),cl()?(A&&w.push(R.rotateBy),k&&w.push(R.widthAuto),F&&w.push(R.canvasSquare),I&&w.push(R.canvasRoomy),W&&w.push(P.flip360),ea&&w.push(P.buzz),N&&w.push(P.float),oa&&w.push(P.jello),Qa&&w.push(P.spinSnap),Za&&w.push(P.spinSnap4),xa&&w.push(P.spinSnap8),sa&&w.push(P.swing),la&&w.push(P.wag),(va.cssPrefix||va.familyPrefix||za)===za?w:w.map(gl)):w}var hl=a=>typeof a=="object"&&"icon"in a&&!!a.icon;function hn(a){if(a)return hl(a)?a:Et.icon(a)}function vl(a){return Object.keys(a)}var vn=new sl("FontAwesomeIcon"),Ot={border:!1,className:"",mask:void 0,maskId:void 0,fixedWidth:!1,inverse:!1,flip:!1,icon:void 0,listItem:!1,pull:void 0,pulse:!1,rotation:void 0,rotateBy:!1,size:void 0,spin:!1,spinPulse:!1,spinReverse:!1,beat:!1,fade:!1,beatFade:!1,bounce:!1,shake:!1,symbol:!1,title:"",titleId:void 0,transform:void 0,swapOpacity:!1,widthAuto:!1,canvasSquare:!1,canvasRoomy:!1,flip360:!1,buzz:!1,float:!1,jello:!1,spinSnap:!1,spinSnap4:!1,spinSnap8:!1,swing:!1,wag:!1},bl=new Set(Object.keys(Ot)),V=xe.forwardRef((a,e)=>{const n={...Ot,...a},{icon:t,mask:r,symbol:o,title:i,titleId:s,maskId:l,transform:c}=n,m=pn(l,!!r),u=pn(s,!!i),p=hn(t);if(!p)return vn.error("Icon lookup is undefined",t),null;const g=pl(n),y=typeof c=="string"?Et.transform(c):c,x=hn(r),h=al(p,{...g.length>0&&{classes:g},...y&&{transform:y},...x&&{mask:x},symbol:o,title:i,titleId:u,maskId:m});if(!h)return vn.error("Could not find icon",p),null;const{abstract:S}=h,A={ref:e};for(const k of vl(n))bl.has(k)||(A[k]=n[k]);return ol(S[0],A)});V.displayName="FontAwesomeIcon";/*!
 * Font Awesome Free 7.3.1 by @fontawesome - https://fontawesome.com
 * License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
 * Copyright 2026 Fonticons, Inc.
 */var yl={prefix:"fas",iconName:"trash",icon:[448,512,[],"f1f8","M136.7 5.9L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-8.7-26.1C306.9-7.2 294.7-16 280.9-16L167.1-16c-13.8 0-26 8.8-30.4 21.9zM416 144L32 144 53.1 467.1C54.7 492.4 75.7 512 101 512L347 512c25.3 0 46.3-19.6 47.9-44.9L416 144z"]},xl={prefix:"fas",iconName:"pen-to-square",icon:[512,512,["edit"],"f044","M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L368 46.1 465.9 144 490.3 119.6c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L432 177.9 334.1 80 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"]},Sl=xl,wl={prefix:"fas",iconName:"database",icon:[448,512,[],"f1c0","M448 205.8c-14.8 9.8-31.8 17.7-49.5 24-47 16.8-108.7 26.2-174.5 26.2S96.4 246.5 49.5 229.8c-17.6-6.3-34.7-14.2-49.5-24L0 288c0 44.2 100.3 80 224 80s224-35.8 224-80l0-82.2zm0-77.8l0-48C448 35.8 347.7 0 224 0S0 35.8 0 80l0 48c0 44.2 100.3 80 224 80s224-35.8 224-80zM398.5 389.8C351.6 406.5 289.9 416 224 416S96.4 406.5 49.5 389.8c-17.6-6.3-34.7-14.2-49.5-24L0 432c0 44.2 100.3 80 224 80s224-35.8 224-80l0-66.2c-14.8 9.8-31.8 17.7-49.5 24z"]},kl={prefix:"fas",iconName:"comment-slash",icon:[576,512,[],"f4b3","M41-25C31.6-34.3 16.4-34.3 7-25S-2.3-.4 7 9L535 537c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-96.6-96.6c44.4-43.2 71.6-101.8 71.6-166.5 0-132.5-114.6-240-256-240-63 0-120.8 21.4-165.4 56.8L41-25zm19.4 155C42.2 163 32 200.3 32 239.9 32 294.2 51.2 344.2 83.6 384.4L34.8 476.7c-4.8 9-3.3 20 3.6 27.5S56.1 514 65.5 510l118.4-50.7c31.8 13.3 67.1 20.7 104.1 20.7 36.4 0 70.9-7.1 102.3-19.9L60.3 130.1z"]},Al={prefix:"fas",iconName:"user-lock",icon:[576,512,[],"f502","M224 8a120 120 0 1 1 0 240 120 120 0 1 1 0-240zM194.3 304l59.4 0c29.7 0 57.7 7.3 82.3 20.1l0 4.3c-19.6 17.6-32 43.1-32 71.5l0 96c0 5.5 .5 10.9 1.3 16.1L45.7 512C29.3 512 16 498.7 16 482.3 16 383.8 95.8 304 194.3 304zm301.7 .1c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 47.9 64 0 0-47.9zM352 400c0-20.9 13.4-38.7 32-45.3l0-50.6c0-44.2 35.8-80 80-80s80 35.8 80 80l0 50.6c18.6 6.6 32 24.4 32 45.3l0 96c0 26.5-21.5 48-48 48l-128 0c-26.5 0-48-21.5-48-48l0-96z"]},jl={prefix:"fas",iconName:"tags",icon:[576,512,[],"f02c","M401.2 39.1L549.4 189.4c27.7 28.1 27.7 73.1 0 101.2L393 448.9c-9.3 9.4-24.5 9.5-33.9 .2s-9.5-24.5-.2-33.9L515.3 256.8c9.2-9.3 9.2-24.4 0-33.7L367 72.9c-9.3-9.4-9.2-24.6 .2-33.9s24.6-9.2 33.9 .2zM32.1 229.5L32.1 96c0-35.3 28.7-64 64-64l133.5 0c17 0 33.3 6.7 45.3 18.7l144 144c25 25 25 65.5 0 90.5L285.4 418.7c-25 25-65.5 25-90.5 0l-144-144c-12-12-18.7-28.3-18.7-45.3zm144-85.5a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"]},Il={prefix:"fas",iconName:"circle-minus",icon:[512,512,["minus-circle"],"f056","M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512zM168 232l176 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-176 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z"]};const q={databaseLock:f.jsx(V,{icon:wl}),loginLock:f.jsx(V,{icon:Al}),postLock:f.jsx(V,{icon:Il}),messageLock:f.jsx(V,{icon:kl}),offerLock:f.jsx(V,{icon:jl}),trash:f.jsx(V,{icon:yl}),edit:f.jsx(V,{icon:Sl})},zl=({userId:a,isActive:e,onChange:n,disabled:t=!1})=>{const r=async o=>{const i=o.target.checked;await n(a,i)};return f.jsx(tr,{checked:e,onChange:r,disabled:t,color:"success"})},Pl=({filtered:a=!1})=>{const{t:e}=ia();return f.jsxs(M,{sx:{py:8,px:3,textAlign:"center"},children:[f.jsx(mr,{sx:{fontSize:64,color:"text.disabled",mb:2}}),f.jsx(O,{variant:"h6",fontWeight:700,gutterBottom:!0,children:e(a?"pages.usersManagement.empty.filteredTitle":"pages.usersManagement.empty.title")}),f.jsx(O,{color:"text.secondary",children:e(a?"pages.usersManagement.empty.filteredText":"pages.usersManagement.empty.text")})]})},Cl={[Y.Admin]:"مدير",[Y.Moderator]:"مشرف",[Y.Client]:"مستخدم"},El={[Y.Admin]:"error",[Y.Moderator]:"warning",[Y.Client]:"info"},Fl=[{key:"canLogin",label:"تسجيل الدخول",icon:q.loginLock},{key:"canCreatePosts",label:"إنشاء المنشورات",icon:q.postLock},{key:"canSendMessages",label:"إرسال الرسائل",icon:q.messageLock},{key:"canSendOffers",label:"إرسال العروض",icon:q.offerLock},{key:"canUseAccount",label:"استخدام الحساب",icon:q.loginLock},{key:"canAccessExistingData",label:"الوصول للبيانات",icon:q.databaseLock}],ma={color:"text.secondary",fontWeight:600,fontSize:"0.8rem",whiteSpace:"nowrap",py:1.5,borderBottom:"none",textAlign:"start"},Ml=({user:a,isActive:e})=>{var r,o,i;const n=ba(),t=!!a.status;return f.jsx(Yt,{to:`/users/customer/${a.slug}`,style:{textDecoration:"none",color:"inherit"},children:f.jsxs(J,{direction:"row",spacing:1.5,alignItems:"center",sx:{opacity:e?1:.6},children:[f.jsx(lr,{overlap:"circular",variant:"dot",anchorOrigin:{vertical:"bottom",horizontal:"right"},sx:{"& .MuiBadge-badge":{width:11,height:11,minWidth:0,borderRadius:"50%",bgcolor:t?n.palette.success.main:n.palette.grey[400],boxShadow:`0 0 0 2px ${n.palette.background.paper}`}},children:f.jsx(fr,{src:(r=a.image)==null?void 0:r.url,alt:`${a.name.first} ${a.name.last}`,sx:{width:42,height:42,fontSize:15,fontWeight:700,bgcolor:L(n.palette.primary.main,.12),color:"primary.main"},children:(o=a.name.first)==null?void 0:o[0]})}),f.jsxs(M,{sx:{minWidth:0},children:[f.jsxs(J,{direction:"row",alignItems:"center",spacing:.5,children:[f.jsxs(O,{variant:"body2",fontWeight:700,noWrap:!0,children:[a.name.first," ",a.name.last]}),a.role===Y.Admin&&f.jsx(gr,{sx:{fontSize:16,color:"error.main"}})]}),f.jsx(O,{variant:"caption",color:"text.secondary",noWrap:!0,sx:{display:"block"},children:a.email}),((i=a.phone)==null?void 0:i.phone_1)&&f.jsxs(O,{variant:"caption",color:"text.secondary",noWrap:!0,dir:"ltr",sx:{display:"block",textAlign:"start"},children:[a.phone.phone_1,a.phone.phone_2?` · ${a.phone.phone_2}`:""]})]})]})})},Ol=({user:a,onPermissionChange:e})=>{const n=ba();return f.jsx(J,{direction:"row",spacing:.5,children:Fl.map(t=>{var i;const r=((i=a.permissions)==null?void 0:i[t.key])??!0,o=r?n.palette.success.main:n.palette.error.main;return f.jsx(Ua,{title:`${t.label}: ${r?"مفعّل":"معطّل"}`,arrow:!0,placement:"top",children:f.jsx(Ya,{size:"small","aria-pressed":r,"aria-label":t.label,onClick:()=>e(a._id,t.key,!r),sx:{width:30,height:30,fontSize:12,borderRadius:1.5,color:o,bgcolor:L(o,r?.1:.08),opacity:r?1:.75,"&:hover":{bgcolor:L(o,.2)}},children:t.icon})},t.key)})})},Ll=({users:a,loading:e,filtered:n=!1,selectedUserIds:t,onSelectionChange:r,onEdit:o,onDelete:i,onRoleChange:s,onAccountStatusChange:l,onPermissionChange:c})=>{const m=ba(),u=a.length>0&&a.every(h=>t.includes(h._id)),p=a.some(h=>t.includes(h._id))&&!u,g=()=>{if(u){const h=a.map(S=>S._id);r(t.filter(S=>!h.includes(S)));return}r([...t,...a.map(h=>h._id).filter(h=>!t.includes(h))])},y=h=>{t.includes(h)?r(t.filter(S=>S!==h)):r([...t,h])},x={borderRadius:3,border:`1px solid ${m.palette.divider}`,overflow:"hidden"};return e?f.jsx(Aa,{elevation:0,sx:{...x,p:2},children:f.jsx(J,{spacing:1.5,children:Array.from({length:6}).map((h,S)=>f.jsxs(J,{direction:"row",spacing:2,alignItems:"center",children:[f.jsx(wa,{variant:"circular",width:42,height:42}),f.jsxs(M,{sx:{flex:1},children:[f.jsx(wa,{width:"30%"}),f.jsx(wa,{width:"20%"})]}),f.jsx(wa,{variant:"rounded",width:110,height:32}),f.jsx(wa,{variant:"rounded",width:90,height:32})]},S))})}):a.length===0?f.jsx(Aa,{elevation:0,sx:x,children:f.jsx(Pl,{filtered:n})}):f.jsx(rr,{component:Aa,elevation:0,sx:{...x,overflowX:"auto"},children:f.jsxs(ir,{sx:{minWidth:960},children:[f.jsx(or,{children:f.jsxs(Te,{sx:{bgcolor:L(m.palette.text.primary,.03)},children:[f.jsx(T,{padding:"checkbox",sx:ma,children:f.jsx(Ne,{checked:u,indeterminate:p,onChange:g})}),f.jsx(T,{sx:ma,children:"المستخدم"}),f.jsx(T,{sx:ma,children:"الدور"}),f.jsx(T,{sx:ma,children:"الحساب"}),f.jsx(T,{sx:ma,children:"الصلاحيات"}),f.jsx(T,{sx:{...ma,textAlign:"center"},children:"إجراءات"})]})}),f.jsx(sr,{children:a.map(h=>{const S=t.includes(h._id),A=h.accountStatus==="active",k=El[h.role],F=m.palette[k].main;return f.jsxs(Te,{hover:!0,selected:S,sx:{"& td":{py:1.5},"&:last-child td":{borderBottom:0},"&.Mui-selected":{bgcolor:L(m.palette.primary.main,.06),"&:hover":{bgcolor:L(m.palette.primary.main,.1)}}},children:[f.jsx(T,{padding:"checkbox",sx:{borderInlineStart:"3px solid",borderInlineStartColor:S?"primary.main":"transparent"},children:f.jsx(Ne,{checked:S,onChange:()=>y(h._id)})}),f.jsx(T,{sx:{textAlign:"start"},children:f.jsx(Ml,{user:h,isActive:A})}),f.jsx(T,{sx:{textAlign:"start"},children:f.jsx(Se,{size:"small",sx:{minWidth:120},children:f.jsx(we,{value:h.role,onChange:I=>s(h.email,I.target.value),sx:{borderRadius:2,fontWeight:600,fontSize:"0.8125rem",color:F,bgcolor:L(F,.07),"& .MuiSelect-select":{py:.75},"& .MuiOutlinedInput-notchedOutline":{borderColor:"transparent"},"&:hover .MuiOutlinedInput-notchedOutline":{borderColor:L(F,.5)},"&.Mui-focused .MuiOutlinedInput-notchedOutline":{borderColor:F}},children:Object.entries(Cl).map(([I,W])=>f.jsx(B,{value:I,sx:{fontWeight:600},children:W},I))})})}),f.jsx(T,{sx:{textAlign:"start"},children:f.jsxs(J,{direction:"row",alignItems:"center",spacing:.5,children:[f.jsx(zl,{userId:h._id,isActive:A,onChange:l}),f.jsx(O,{variant:"body2",fontWeight:700,color:A?"success.main":"error.main",children:A?"نشط":"معطّل"})]})}),f.jsx(T,{sx:{textAlign:"start"},children:f.jsx(Ol,{user:h,onPermissionChange:c})}),f.jsx(T,{children:f.jsxs(J,{direction:"row",spacing:.5,justifyContent:"center",children:[f.jsx(Ua,{title:"تعديل",arrow:!0,children:f.jsx(Ya,{size:"small","aria-label":"تعديل",onClick:()=>o(h._id),sx:{color:"text.secondary","&:hover":{color:"primary.main",bgcolor:L(m.palette.primary.main,.1)}},children:q.edit})}),f.jsx(Ua,{title:"حذف",arrow:!0,children:f.jsx(Ya,{size:"small","aria-label":"حذف",onClick:()=>i(h._id),sx:{color:"text.secondary","&:hover":{color:"error.main",bgcolor:L(m.palette.error.main,.1)}},children:q.trash})})]})})]},h._id)})})]})})},_l=({page:a,totalPages:e,totalItems:n,rowsPerPage:t,onPageChange:r})=>{if(n===0)return null;const o=(a-1)*t+1,i=Math.min(a*t,n);return f.jsxs(M,{sx:{mt:3,display:"flex",alignItems:"center",justifyContent:"space-between",gap:2,flexWrap:"wrap"},children:[f.jsxs(O,{variant:"body2",color:"text.secondary",children:["عرض ",o," - ",i," من"," ",n]}),f.jsx(cr,{page:a,count:e,color:"primary",shape:"rounded",onChange:(s,l)=>r(l)})]})},Tl=({userId:a,open:e,direction:n,onClose:t})=>{const{t:r}=ia();return f.jsxs(bn,{open:e,onClose:t,maxWidth:"md",fullWidth:!0,dir:n,children:[f.jsx(yn,{align:"center",children:r("pages.usersManagement.editTitle")}),f.jsx(xn,{children:a&&f.jsx(pr,{userId:a,mode:"edit"})}),f.jsx(Sn,{sx:{justifyContent:"center",pb:2},children:f.jsx(K,{variant:"contained",color:"error",onClick:t,sx:{borderRadius:2},children:r("pages.usersManagement.close")})})]})},Nl=({open:a,userName:e,onClose:n,onConfirm:t})=>{const r=ba(),{t:o}=ia();return f.jsxs(bn,{open:a,onClose:n,maxWidth:"xs",fullWidth:!0,slotProps:{paper:{sx:{borderRadius:4}}},children:[f.jsx(M,{sx:{display:"flex",justifyContent:"center",pt:3},children:f.jsx(M,{sx:{width:56,height:56,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"error.main",bgcolor:L(r.palette.error.main,.1)},children:f.jsx(wn,{fontSize:"large"})})}),f.jsx(yn,{align:"center",fontWeight:800,children:o("pages.usersManagement.actions.delete")}),f.jsx(xn,{children:f.jsx(O,{align:"center",color:"text.secondary",children:o("pages.usersManagement.actions.deleteMessage",{name:e||""})})}),f.jsxs(Sn,{sx:{justifyContent:"center",gap:1,pb:3,px:3},children:[f.jsx(K,{fullWidth:!0,variant:"outlined",color:"inherit",onClick:n,sx:{borderRadius:2},children:o("pages.usersManagement.actions.cancelDelete")}),f.jsx(K,{fullWidth:!0,variant:"contained",color:"error",disableElevation:!0,onClick:t,sx:{borderRadius:2},children:o("pages.usersManagement.actions.confirmDelete")})]})]})},Rl=a=>{const[e,n]=C.useState([]),[t,r]=C.useState(!0),o=C.useCallback(async()=>{r(!0);try{const u=await Ht();n(u)}catch(u){Sa(u instanceof Error?u.message:a("pages.usersManagement.errors.load"))}finally{r(!1)}},[a]);return C.useEffect(()=>{o()},[o]),{users:e,setUsers:n,loading:t,loadUsers:o,updateUserRole:async(u,p)=>{try{await Kt(u,p),n(g=>g.map(y=>y.email===u?{...y,role:p}:y))}catch(g){Sa(g instanceof Error?g.message:a("pages.usersManagement.errors.role"))}},deleteUser:async u=>{try{return await qt(u),n(p=>p.filter(g=>g._id!==u)),!0}catch(p){return Sa(p instanceof Error?p.message:a("pages.usersManagement.errors.delete")),!1}},updateUserStatus:(u,p)=>{n(g=>g.map(y=>y._id===u?{...y,status:p}:y))},handleAccountStatus:async(u,p)=>{try{const y=await Vt(u,p?"active":"disabled");return n(x=>x.map(h=>h._id===u?{...h,accountStatus:y.user.accountStatus}:h)),!0}catch(g){return Sa(g instanceof Error?g.message:"Failed to update account status"),!1}},handleUserPermission:async(u,p,g)=>{try{const y=await Gt(u,p,g);return n(x=>x.map(h=>h._id===u?{...h,permissions:y.user.permissions}:h)),!0}catch(y){return Sa(y instanceof Error?y.message:"Failed to update permission"),!1}}}},$l=a=>{C.useEffect(()=>{const e=async({userId:t})=>{try{await _e(t,!0),a(t,!0)}catch(r){console.error("User connection update failed:",r)}},n=async({userId:t})=>{try{await _e(t,!1),a(t,!1)}catch(r){console.error("User disconnection update failed:",r)}};return Oa.on("user:newUserLoggedIn",e),Oa.on("user:disconnected",n),()=>{Oa.off("user:newUserLoggedIn",e),Oa.off("user:disconnected",n)}},[a])},Dl=a=>{const[e,n]=C.useState({search:"",status:"all",role:"all"}),t=l=>{n(c=>({...c,search:l}))},r=l=>{n(c=>({...c,status:l}))},o=l=>{n(c=>({...c,role:l}))},i=()=>{n({search:"",status:"all",role:"all"})},s=C.useMemo(()=>{const l=e.search.trim().toLowerCase();return a.filter(c=>{const m=`${c.name.first} ${c.name.last}`.toLowerCase(),u=!l||m.includes(l)||c.email.toLowerCase().includes(l),p=e.status==="all"||e.status==="active"&&c.status===!0||e.status==="inactive"&&c.status===!1,g=e.role==="all"||c.role===e.role;return u&&p&&g})},[a,e]);return{filters:e,filteredUsers:s,setSearch:t,setStatus:r,setRole:o,resetFilters:i}},Wl=a=>({total:a.length,active:a.filter(e=>e.status===!0).length,inactive:a.filter(e=>e.status!==!0).length,admins:a.filter(e=>e.role==="Admin").length,moderators:a.filter(e=>e.role==="Moderator").length,clients:a.filter(e=>e.role==="Client").length}),Ra=10,lf=()=>{const{t:a}=ia(),e=Jt(),{users:n,loading:t,updateUserRole:r,deleteUser:o,updateUserStatus:i,handleAccountStatus:s,handleUserPermission:l}=Rl(a);$l(i);const{filters:c,filteredUsers:m,setSearch:u,setStatus:p,setRole:g,resetFilters:y}=Dl(n),[x,h]=C.useState(null),[S,A]=C.useState(null),[k,F]=C.useState([]),[I,W]=C.useState(""),[ea,N]=C.useState(1),oa=C.useMemo(()=>Wl(n),[n]),Qa=Math.ceil(m.length/Ra),Za=C.useMemo(()=>{const z=(ea-1)*Ra;return m.slice(z,z+Ra)},[m,ea]),xa=C.useMemo(()=>n.find(z=>z._id===S),[n,S]),sa=c.role,la=c.status,Ma=!!c.search||sa!=="all"||la!=="all",w=C.useMemo(()=>sa==="Admin"?"admins":la==="active"?"active":la==="inactive"?"inactive":sa==="all"?"total":null,[sa,la]),fa=()=>{F([]),W("")},Lt=async()=>{k.length!==0&&(await Promise.all(k.map(z=>i(z,!0))),fa())},_t=async()=>{k.length!==0&&(await Promise.all(k.map(z=>i(z,!1))),fa())},Tt=async()=>{if(!I||k.length===0)return;const z=n.filter(ca=>ca._id&&k.includes(ca._id));await Promise.all(z.map(ca=>r(ca.email,I))),fa()},Nt=async()=>{k.length===0||!window.confirm(`${a("pages.usersManagement.bulk.deleteConfirm")} (${k.length})`)||(await Promise.all(k.map(ca=>o(ca))),fa())},Rt=async()=>{if(!S)return;await o(S)&&A(null)},$t=z=>{u(z),N(1)},Dt=z=>{g(z),N(1)},Wt=()=>{y(),N(1)},Ut=z=>{p("all"),g("all"),z==="active"&&p("active"),z==="inactive"&&p("inactive"),z==="admins"&&g("Admin"),N(1)};return f.jsxs(M,{dir:e,sx:{minHeight:"100vh",bgcolor:"background.default",py:{xs:2,md:4},px:{xs:1.5,sm:2,md:4},pb:k.length>0?{xs:22,md:14}:void 0},children:[f.jsxs(J,{spacing:3,sx:{maxWidth:1400,mx:"auto"},children:[f.jsx(vr,{totalUsers:oa.total}),f.jsx(br,{stats:oa,active:w,onSelect:Ut}),f.jsx(yr,{search:c.search,status:c.status,role:c.role,onSearch:$t,onRoleChange:Dt,onReset:Wt}),f.jsxs(M,{children:[f.jsx(Ll,{users:Za,loading:t,filtered:Ma,selectedUserIds:k,onSelectionChange:F,onEdit:h,onDelete:A,onRoleChange:r,onPermissionChange:l,onAccountStatusChange:s}),f.jsx(_l,{page:ea,totalPages:Qa,totalItems:m.length,rowsPerPage:Ra,onPageChange:N})]})]}),f.jsx(xr,{selectedCount:k.length,selectedRole:I,onRoleChange:W,onBulkRoleUpdate:Tt,onActivate:Lt,onDeactivate:_t,onDelete:Nt,onClear:fa,t:a,direction:e}),f.jsx(Tl,{userId:x,open:!!x,direction:e,onClose:()=>h(null)}),f.jsx(Nl,{open:!!S,userName:xa?`${xa.name.first} ${xa.name.last}`:void 0,onClose:()=>A(null),onConfirm:Rt})]})};export{lf as default};
