@if($as === "link")
	<a class="inline-block mt-4 px-3 py-2 bg-black text-white hover:bg-gray-800 hover:underline" href="{{ $href }}" {{ $downloadable ? "download" : "" }}>
		{{ $slot }}
	</a>
@else
	<button class="inline-block mt-4 px-3 py-2 bg-black text-white hover:bg-gray-800">
		{{ $slot }}
	</button>
@endif
