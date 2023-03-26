# Cognitive Canvas Template

## Quick Start

1. Clone this repo.
2. cd to the cloned directory.
3. npx serve

The default for npx serve is to start a static server at port 5000. This is the default port Cognitive Canvas looks for
when publishing a new collection.

1. Go to [Publishing on Cognitive Canvas](https://cognitivecanvas.xyz/public/publish).
2. Click the **Create** button from the **Create a New Collection** card in the swiper.
3. All of the fields can be modified at any time before publishing, so supply as much as you can, but it is
   not important to have everything perfect at this time.
4. The only important field to consider is the **slug** field. This must be globally unique and is limited to 32
   ASCII characters. We recommend using a kebab-case name with a unique domain or artist name as a part of the slug.
   For example, we use _cognitive-_ as a prefix for collections published under our brand.
5. Click the **Create** button to create your collection.

You will see the template card appear in the swiper.

1. Click the collection in the swiper to load it.
2. The template UI will appear.
3. Start coding!
4. The template code is running live. If you make changes, simply click the collection in the swiper
   again to get it to reload in the Cognitive Canvas iframe and pick up your changes.

## Intro

This is a Cognitive Canvas template to get you started. It is a very good starting point for most projects, as
it can easily be adopted to many use cases. 

The template uses q5.js, which is a stripped down version of p5.js by the same author as p5.js. q5 has most of 
p5 and is 10x smaller. If you plan on using [Bitcoin Ordinals](https://cognitivecanvas.xyz/public/doc/ordinals), q5 is supported, p5 is not (too large).

Be sure to read [Publishing](https://cognitivecanvas.xyz/public/doc/publishing) which contains details of how
collections work.

## Template Description

The template is very advanced, in that it supports about everything you need to get the best possible live 
minting experience. 

It supports the following:

1. Full screen.
2. Optimal placement depending on context. For example, when in full screen mode, if the size is smaller than 
the screen, it will be centered. In the CC UI, it will be aligned correctly. If not in live mode, the artwork 
will be centered, etc.
3. Many of the common UI components are used, such as selectors, color selectors, inputs, etc.
4. The communication with CC is all streamlined, there is nothing you have to do to start creating.
5. A drawing loop is set up that will incrementally render your artwork. This is always a good practice
as it is a much better user experience. This can be easily adapted to most artworks.
6. Handling custom parameters and attributes are clearly seen in the code.
7. Thumbnail generation is built in.
8. Seed handling is built in.
9. The size of the artwork adapts to the screen size. 
10. The 4 required images are included, *thumbnail.png*, *opensea-banner.png*, *opensea.png*, and *avatar.png*.

## Customizing

The only two files you need to pay attention to (initially) are parameters.js and sketch.js. 

* *parameters.js* contains the modifiable parameters for the artwork
* *sketch.js* contains the arwork generation javascript.

All files are heavily commented. Have a look and start coding!
