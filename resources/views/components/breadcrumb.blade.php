@if(count($items) > 0)
	<ul class="breadcrumb">
		@foreach($items as $item)
			@if(empty($item["url"]))
				<li class="breadcrum-item">{{ $item["title"] }}</li>
			@else
				<li class="breadcrum-item">
					<a href="{{ $item["url"] }}">{{ $item["title"] }}</a>
				</li>
			@endif
		@endforeach
	</ul>
@endif