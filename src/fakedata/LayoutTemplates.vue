<template>
  <!-- Expample: Card with defined width -->
  <div
      class="
        max-w-md
        mx-auto
        bg-white
        rounded-xl
        shadow-md
        overflow-hidden
        md:max-w-2xl
      "
    >
  <!-- Example: Pic and Text full with -->
<div class="mx-auto bg-white shadow-md overflow-hidden">
      <div class="md:flex">
        <div class="md:flex-shrink-0">
          <img
            class="h-48 w-full object-cover md:h-full md:w-48"
            src="/assets/img/song-header.png"
            alt="Man looking at item at a store"
          />
        </div>
        <div class="p-8">
          <div
            class="
              uppercase
              tracking-wide
              text-sm text-indigo-500
              font-semibold
            "
          >
            Case study
          </div>
          <a
            href="#"
            class="
              block
              mt-1
              text-lg
              leading-tight
              font-medium
              text-black
              hover:underline
            "
            >Finding customers for your new business</a
          >
          <p class="mt-2 text-gray-500">
            Getting a new business off the ground is a lot of hard work. Here
            are five ideas you can use to find your first customers.
          </p>
        </div>
      </div>
    </div>
  <!-- Example: Text and Text 50% 50% -->
<div class="mx-auto bg-white shadow-md overflow-hidden">
      <div class="md:flex">
        <div class="p-8">
          <div
            class="
              uppercase
              tracking-wide
              text-sm text-indigo-500
              font-semibold
            "
          >
            Case study
          </div>
          <a
            href="#"
            class="
              block
              mt-1
              text-lg
              leading-tight
              font-medium
              text-black
              hover:underline
            "
            >Finding customers for your new business</a
          >
          <p class="mt-2 text-gray-500">
            Getting a new business off the ground is a lot of hard work. Here
            are five ideas you can use to find your first customers.
          </p>
        </div>
        <div class="p-8">
          <div
            class="
              uppercase
              tracking-wide
              text-sm text-indigo-500
              font-semibold
            "
          >
            Case study
          </div>
          <a
            href="#"
            class="
              block
              mt-1
              text-lg
              leading-tight
              font-medium
              text-black
              hover:underline
            "
            >Finding customers for your new business</a
          >
          <p class="mt-2 text-gray-500">
            Getting a new business off the ground is a lot of hard work. Here
            are five ideas you can use to find your first customers.
          </p>
        </div>
      </div>
    </div>
  <!-- Example: Text and Text mit Begrenzung der linken Spalte ab md -->
 <div class="mx-auto bg-white shadow-md overflow-hidden">
      <div class="md:flex">
        <div class="p-8 md:w-48">
          <div
            class="
              uppercase
              tracking-wide
              text-sm text-indigo-500
              font-semibold
            "
          >
            Case study
          </div>
          <a
            href="#"
            class="
              block
              mt-1
              text-lg
              leading-tight
              font-medium
              text-black
              hover:underline
            "
            >Finding customers for your new business</a
          >
          <p class="mt-2 text-gray-500">
            Getting a new business off the ground is a lot of hard work. Here
            are five ideas you can use to find your first customers.
          </p>
        </div>
        <div class="p-8">
          <div
            class="
              uppercase
              tracking-wide
              text-sm text-indigo-500
              font-semibold
            "
          >
            Case study
          </div>
          <a
            href="#"
            class="
              block
              mt-1
              text-lg
              leading-tight
              font-medium
              text-black
              hover:underline
            "
            >Finding customers for your new business</a
          >
          <p class="mt-2 text-gray-500">
            Getting a new business off the ground is a lot of hard work. Here
            are five ideas you can use to find your first customers.
          </p>
        </div>
      </div>
    </div> 
  <!-- Example: Text and Text mit Begrenzung der linken Spalte ab md -->
  <!-- Form for Comment can be used later for Notes-->
  <!-- Area below is still static mockup -->
 <section class="container mx-auto mt-6" id="comments">
      <div
        class="bg-white rounded border border-gray-200 relative flex flex-col"
      >
        <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
          <span class="card-title"
            >Comments (15) / Area below is static mockup</span
          >
          <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
        </div>
        <div class="p-6">
          <form>
            <textarea
              class="
                block
                w-full
                py-1.5
                px-3
                text-gray-800
                border border-gray-300
                transition
                duration-500
                focus:outline-none
                focus:border-black
                rounded
                mb-4
              "
              placeholder="Your comment here..."
            ></textarea>
            <button
              type="submit"
              class="py-1.5 px-3 rounded text-white bg-green-600 block"
            >
              Submit
            </button>
          </form>
          <select
            class="
              block
              mt-4
              py-1.5
              px-3
              text-gray-800
              border border-gray-300
              transition
              duration-500
              focus:outline-none
              focus:border-black
              rounded
            "
          >
            <option value="1">Latest</option>
            <option value="2">Oldest</option>
          </select>
        </div>
      </div>
    </section>
  <!-- Comments
    Fully skipped Comments handling with:
    Sorting on client side with sort()
    Save current Sort Order in Query Params
    -->
<ul class="container mx-auto">
      <li class="p-6 bg-gray-50 border border-gray-200">
        <div class="mb-5">
          <div class="font-bold">Elaine Dreyfuss</div>
          <time>5 mins ago</time>
        </div>

        <p>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium der doloremque laudantium.
        </p>
      </li>
    </ul>
</template>