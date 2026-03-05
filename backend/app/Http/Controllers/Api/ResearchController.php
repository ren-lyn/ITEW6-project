<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Research;
use Illuminate\Http\Request;

class ResearchController extends Controller
{
    public function index(Request $request)
    {
        $query = Research::query();
        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->input('search') . '%');
        }
        return response()->json($query->paginate(15));
    }

    public function store(Request $request)
    {
        $research = Research::create($request->all());
        return response()->json($research, 201);
    }

    public function show(Research $research)
    {
        return response()->json($research);
    }

    public function update(Request $request, Research $research)
    {
        $research->update($request->all());
        return response()->json($research);
    }

    public function destroy(Research $research)
    {
        $research->delete();
        return response()->json(['message' => 'Deleted']);
    }
}
